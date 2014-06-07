import re
import sys
import IfcImport as ifc

get = lambda e,n: e.get_argument(e.get_argument_index(n))
uri = re.compile("^http://.+$")
map = {'str':'string', 'int':'integer'}

f = ifc.open(sys.argv[1])
es = f.by_type("IfcPropertySet")
for e in es:
	os = e.get_inverse("PropertyDefinitionOf")
	if len(os) == 1:
		ro = get(os[0], "RelatedObjects")
		for r in ro:
			guid = get(r, "GlobalId")
			props = get(e, "HasProperties")
			for prop in props:
				if prop.is_a("IfcPropertySingleValue"):
					name = get(prop, "Name")
					if name and uri.match(name):
						val = get(prop, "NominalValue")
						if val:
							val = get(val, "wrappedValue")
							ty = val.__class__.__name__
							print (":%s <%s> \"%s\"^^xsd:%s"%(guid, name, str(val), map.get(ty, ty)))

			