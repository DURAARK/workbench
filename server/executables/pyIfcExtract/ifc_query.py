import re
import ifc
import sys
import json
import string
import datetime
import rdf_extractor
from functools import reduce

ifc_file = None
rdf_repos = []
pattern_class = re.compile("").__class__
external_namespaces_used = [
    ('dura', '<http://duraark.org/ontology#>'),
    ('xsd', '<http://www.w3.org/2001/XMLSchema#>')
]

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
    ifc_file = ifc.open(fn)
    find_rdf_repos()

class query:
    class instance_list:
        def __init__(self, prefix=None, instances=None):
            self.prefix = prefix or ''
            self.instances = instances or []
        def __add__(self, other):
            return query.instance_list(
                self.prefix if len(self.prefix) > len(other.prefix) else other.prefix,
                self.instances + other.instances
            )
        def __getattr__(self, k):
            li = list(map(lambda e: getattr(e, k), self.instances))
            classes = list(map(type, li))
            if query.instance_list in classes:
                return sum(li, query.instance_list())
            return li
        def __repr__(self):
            return ",\n".join("  - %s"%v.instance for v in self.instances)
        def __len__(self): return len(self.instances)
            
    class instance:
        def __init__(self, prefix, instance):
            self.prefix = prefix
            self.instance = instance
        def wrap_value(self, v, k):
            wrap = lambda e: query.instance("%s.%s"%(self.prefix,k), e)
            if isinstance(v, ifc.entity_instance): return wrap(v)
            elif isinstance(v, (tuple, list)) and len(v):
                classes = list(map(type, v))
                if ifc.entity_instance in classes: 
                    return query.instance_list("%s.%s"%(self.prefix,k), list(map(wrap, v)))
            return v
        def __getattr__(self, k):
            return self.wrap_value(getattr(self.instance, k), k)
            
    class parameter_list:
        def __init__(self, li=None):
            self.li = li or []
        def __add__(self, other):
            return query.parameter_list(self.li + other.li)
        def __or__(self, other):
            result = query.parameter_list()
            for i in range(max(len(self.li), len(other.li))):
                a1,b1, a2,b2 = '', None, '', None
                try: a1, b1 = self.li[i]
                except: pass
                try: a2, b2 = other.li[i]
                except: pass
                result.li.append((a1 if len(a1) > len(a2) else a2, b1 if b1 else b2))
            return result
        def __and__(self, other):
            e = lambda s: s if s else ""
            return query.parameter_list(
                [(skv[0],e(skv[1]) + e(okv[1])) for skv, okv in zip(self.li, other.li)]
            )
        def bind(self, name):
            return query.parameter_list([(name, v) for old_name, v in self.li])
        @staticmethod
        def count(query):
            return query.parameter_list([("%s.Count"%(query.prefix), len(query.entities))])
        def unique(self):
            value_set = set()
            result = query.parameter_list()
            for k, v in self.li:
                if v not in value_set:
                    value_set.add(v)
                    result.li.append((k, v))
            return result
        def apply(self, fn):
            return query.parameter_list([(k, fn(v)) for k, v in self.li])
        def __repr__(self):
            return ",\n".join("  - %s: %s"%(k,v) for k,v in self.li)

    
    def __init__(self, instances, prefix=None):
        self.prefix = prefix or ""
        is_instance_list = isinstance(instances, query.instance_list)
        if not is_instance_list:
            classes = list(map(type, instances))
            if query.instance in classes:
                is_instance_list = True
                instances = query.instance_list(self.prefix, instances)                
        if is_instance_list:
            self.entities = instances
            self.params = None
        else:
            self.entities = None
            self.params = query.parameter_list([(self.prefix, v) for v in instances])
    def __getattr__(self, k):
        if self.params: raise AttributeError()
        return query(getattr(self.entities, k), "%s.%s"%(self.prefix,k))
    def __or__(self, other):
        if self.entities and other.entities:
            q = query(self.entities + other.entities, self.prefix)
        elif self.params and other.params:
            q = query([], self.prefix)
            q.params = self.params | other.params
        else: raise AttributeError()
        return q
    def __rshift__(self, other):
        q = query([], self.prefix)
        if isinstance(other, str): 
            # `other` is a string that describes the new name bound to the parameters in this query object
            q.params = self.params.bind(other)
        elif isinstance(other, query_count):
            # `other` is the formatters.count object, which means we add a new result parameter and initialize it to
            # the amount of instances
            q.params = query.parameter_list.count(self)
        elif isinstance(other, query_unique):
            # `other` is the formatters.unique object, which means filter out non-unique parameters
            q.params = self.params.unique()
        elif hasattr(other, '__call__'):
            # some lambda function, probably also an attribute of the formatters collection class
            q.params = self.params.apply(other)
        else: raise
        return q
    def __add__(self, other):
        if isinstance(other, self.__class__):
            q = query([], self.prefix)
            q.params = self.params & other.params
            return q
        else:
            return self >> (lambda s: s + other)
            
    def filter(self, **kwargs):
        def matches(entity):
            for k, v in kwargs.items():
                val = getattr(entity, k)
                if isinstance(v, pattern_class):
                    if not val or v.match(val) is None: return False
                else:
                    if val != v: return False
            return True
        q = query([i for i in self.entities.instances if matches(i)], self.prefix)
        return q
        
    def __repr__(self):
        if self.entities:
            return "<Unbound query '%s'\n  Entities:\n%s\n>"%(self.prefix, self.entities)
        else:
            return "<Bound query '%s'\n  Parameters:\n%s\n>"%(self.prefix, self.params)


class Multiple(query):
    def __init__(self, nm): self.nm = nm; query.__init__(self, self.as_list(), nm)
    def as_list(self): return list(map(lambda e: query.instance(self.nm, e), ifc_file.by_type(self.nm)))
    def annotate(self, idx): return "_%d"%idx


class Single(Multiple):
    def __init__(self, nm): self.nm = nm; query.__init__(self, self.as_list(), nm)
    def annotate(self, idx): return ""
    def as_list(self):
        li = super(Single, self).as_list()
        if len(li) != 1: raise AttributeError
        return li


class RdfRepositories(query):
    def __init__(self): pass
    def __getattr__(self, k):
        if k == 'params':
            return query.parameter_list([('RdfRepositories',v) for v in rdf_repos])


RDF_REPOSITORIES = RdfRepositories()

class query_unique: pass
class query_count: pass
class formatter: pass
class latlon(formatter):
    @staticmethod
    def to_float(compound):
        magnitudes = [1., 60., 3600., 3600.e6][:len(compound)]
        return sum(a/b for a,b in zip(compound, magnitudes))
    def __init__(self, *args):
        if len(args) == 1: self.items = args[0]
        else: self.items = [args]
    def __add__(self, other):
        return latlon(self.items + other.items)
    def __repr__(self):
        return "%s: %s"%(self.k, ".".join(str(x) for x in self.v))
    def __getattr__(self, k):
        return [x[1] for x in self.items if x[0] == k][0]
    def to_rdf(self):
        external_namespaces_used.append(('wgs84_pos', '<http://www.w3.org/2003/01/geo/wgs84_pos#>'))
        return '[ wgs84_pos:lat "%.8f" ; wgs84_pos:lon "%.8f" ]'%(latlon.to_float(self.Latitude), latlon.to_float(self.Longitude))


class formatters:
    time = lambda ts: datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
    latitude = lambda v: latlon('Latitude', v)
    longitude = lambda v: latlon('Longitude', v)
    join = lambda li: " ".join(li) if li else None
    unique = query_unique()
    count = query_count()
    expand_guid = ifc.guid.expand


class JsonFormatter:
    def __lshift__(self, li):
        di = {}
        for item in li:
            di.update(item.params)
        json.dump(di, sys.stdout, indent='  ')

json_formatter = JsonFormatter()

class rdf_formatter:
    def __init__(self, name_query):
        self.uri = name_query.params.li[0][1]
    def __lshift__(self, li):
        lines = []
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
            elif isinstance(s, formatter): return s.to_rdf()
            else: return '"%s"^^xsd:string'%escape(str(s))
        for item in li:
            for p in item.params.li:
                if p[1] is not None:
                    lines.append("<project_%s> dura:%s %s ."%(self.uri,p[0],typify(p[1])))
        for ns in external_namespaces_used:
            print("@prefix %s: %s ."%ns)
        if len(external_namespaces_used): print("")
        for line in lines: print(line)
