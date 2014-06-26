# Please don't look inside.. the horror...















































# No really.. don't
























import re
import sys
import json
import string
import datetime
import IfcImport
import rdf_extractor
from functools import reduce

ifc_file = None
rdf_repos = []
pattern_class = re.compile("").__class__

def find_rdf_repos():
	def is_uri(s):
		if (s[0]+s[-1]) == '<>':
			if '#' in s: return s[1:-1].split('#')[0]
			else: return s[1:-1].rsplit('/', 1)[0]				
		return None
	triples = rdf_extractor.obtain(ifc_file)
	repos = set()
	for spo in triples:
		for str in spo[1:]:
			uri = is_uri(str)
			if uri: repos.add(uri)
	rdf_repos[:] = sorted(repos)

def load(fn):
	global ifc_file
	ifc_file = IfcImport.open(fn)
	find_rdf_repos()

class Query:
	def __init__(self, instances): self.instances = instances; self.params = []
	def annotate(self, idx): return "_%d"%idx
	def __getattr__(self, k):
		def q():
			def mk_arg(nm, idx, inst):
				try: arg = inst.get_argument(inst.get_argument_index(k))
				except: arg = inst.get_inverse(k)
				nm = getattr(inst, 'prefix', nm)
				if isinstance(arg, IfcImport.Entity):
					arg.prefix = "%s%s.%s"%(nm, self.annotate(idx), k)
					return [arg]
				elif isinstance(arg, [].__class__) and all([isinstance(itm, IfcImport.Entity) for itm in arg]):
					for idx, itm in enumerate(arg): 
						itm.prefix = "%s%s.%s"%(nm, self.annotate(idx), k)
					return arg
				else:
					self.params.append(("%s%s.%s"%(nm, self.annotate(idx), k), arg))
					return []
			q = Query(sum([mk_arg(self.nm, idx, inst) for idx, inst in enumerate(self.instances)], []))
			q.nm = "%s.%s"%(self.nm, k)
			q.params = self.params
			return q
		return q
	def __or__(self, other):
		return Query(self.instances + other.instances)
	def Filter(self, **kwargs):
		def matches(i):
			for k,v in kwargs.items():
				val = i.get_argument(i.get_argument_index(k))
				if isinstance(v, pattern_class):
					if not val or v.match(val) is None: return False
				else:
					if val != v: return False
			return True
		q = Query([i for i in self.instances if matches(i)])
		q.nm = self.nm
		return q
	def __and__(self, di):
		def matches(i):
			for k,v in di.items():
				if i.get_argument(i.get_argument_index(k)) != v: return False
			return True
		q = Query([i for i in self.instances if matches(i)])
		q.nm = self.nm
		return q
	def __rshift__(self, nm):
		q = Query([])
		if isinstance(nm, "".__class__):
			q.params = [(nm,v) for k,v in self.params]
		elif nm.__class__.__name__ == 'qcount':
			q.params = [("%s.Count"%(self.nm),len(self.instances))]
		elif nm.__class__.__name__ == 'qunique':
			value_set = set()
			q.params = []
			for k,v in self.params:
				if v not in value_set:
					value_set.add(v)
					q.params.append((k, v))
		else:
			q.params = [(k,nm(v)) for k,v in self.params]
		return q
	def __or__(self, other):
		q = Query([])
		q.params = [(skv[0],skv[1] if skv[1] else okv[1]) for skv, okv in zip(self.params, other.params)]
		return q
	def __add__(self, other):
		if isinstance(other, self.__class__):
			e = lambda s: s if s else ""
			q = Query([])
			q.params = [(skv[0],e(skv[1]) + e(okv[1])) for skv, okv in zip(self.params, other.params)]
			return q
		else:
			return self >> (lambda s: s + other)
		
	
class Multiple(Query):
	def __init__(self, nm): self.nm = nm; Query.__init__(self, self.as_list())
	def as_list(self): return ifc_file.by_type(self.nm)
	def annotate(self, idx): return "_%d"%idx
	
	
class Single(Multiple):
	def __init__(self, nm): self.nm = nm; Query.__init__(self, self.as_list())
	def annotate(self, idx): return ""
	def as_list(self): 
		li = super(Single, self).as_list()
		if len(li) != 1: raise AttributeError
		return li


class RdfRepositories(Query):
	def __init__(self): pass
	def __getattr__(self, k):
		if k == 'params':
			return [('RdfRepositories',v) for v in rdf_repos]

	
RDF_REPOSITORIES = RdfRepositories()
		
class guid:
	chars = string.digits + string.ascii_uppercase + string.ascii_lowercase + '_$'
	@staticmethod
	def compress(g):
		bs = [int(g[i:i+2], 16) for i in range(0, len(g), 2)]
		def b64(v, l=4):
			return ''.join([guid.chars[(v // (64**i))%64] for i in range(l)][::-1])
		return ''.join([b64(bs[0], 2)] + [b64((bs[i] << 16) + (bs[i+1] << 8) + bs[i+2]) for i in range(1,16,3)])
	@staticmethod
	def expand(g):		
		def b64(v):
			return reduce(lambda a, b: a * 64 + b, map(lambda c: guid.chars.index(c), v))
		bs = [b64(g[0:2])]
		for i in range(5):
			d = b64(g[2+4*i:6+4*i])
			bs += [(d >> (8*(2-j)))%256 for j in range(3)]
		return ''.join(['%02x'%b for b in bs])


class formatters:
	time = lambda ts: datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
	latlon = lambda fmt: lambda ll: "%s: %s;"%(fmt, ".".join(str(l) for l in ll)) if ll else ""
	join = lambda li: " ".join(li)
	unique = type('qunique', (), {})()
	count = type('qcount', (), {})()
	expand_guid = guid.expand


class JsonFormatter:
	def __lshift__(self, li):
		di = {}
		for item in li:
			di.update(item.params)
		json.dump(di, sys.stdout, indent='  ')
			
json_formatter = JsonFormatter()

class rdf_formatter:
	def __init__(self, name_query):
		self.uri = name_query.params[0][1]
	def __lshift__(self, li):
		def escape(s):
			"""
			Escape according to Turtle - Terse RDF Triple Language 3.3. String Escapes
			
			NB: Turtle can be UTF-8 encoded, but since output is written to stdout,
				which doesn't speak UTF-8 on Windows, all Unicode characters outside
				the printable character range of ASCII are escaped.
			"""
			escape_dict = {
				'\t': '\\t',
				'\n': '\\n',
				'\r': '\\r',
				'"' : '\\"',
				'\\': '\\\\'
			}
			def escape_char(c):
				if c in escape_dict: return escape_dict.get(c)
				if ord(c) < 0x20 or ord(c) > 0x7e:
					return "\\u%s"%"%04x"%ord(c)
				else: return c
			return ''.join(map(escape_char, s))
		def typify(s):
			if isinstance(s, int): return '"%d"^^xsd:integer'%s
			else: return '"%s"^^xsd:string'%escape(str(s))
		for item in li:
			for p in item.params:
				if p[1] is not None:
					print (":project_%s :%s %s ."%(self.uri,p[0],typify(p[1])))
			

			