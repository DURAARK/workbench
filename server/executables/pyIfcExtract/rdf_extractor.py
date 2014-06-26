import re
import sys

get = lambda e,n: e.get_argument(e.get_argument_index(n))
uri_pred = re.compile("^<(http://[^>]+)>$")
uri_val = re.compile("^(http://.+)$")
map = {'str':'string', 'int':'integer'}

def obtain(f):
    return_list = []
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
                        if name:
                            match = uri_pred.match(name)
                            predicate = object = None
                            predicate_is_uri = object_is_uri = False
                            if match:
                                name_uri = match.group(1)
                                predicate = '<%s>'%(name_uri)
                                predicate_is_uri = True
                            else:
                                predicate = '"%s"^^xsd:string'%(name)
                            val = get(prop, "NominalValue")
                            if val:
                                val = get(val, "wrappedValue")
                                if isinstance(val, str):
                                    match = uri_val.match(val)
                                    if match:
                                        val_uri = match.group(1)
                                        object = '<%s>'%(val_uri)
                                        object_is_uri = True
                                    else:
                                        ty = val.__class__.__name__
                                        object = '"%s"^^xsd:%s'%(str(val), map.get(ty, ty))
                            if predicate_is_uri:
                                return_list.append((":%s"%guid, predicate, object))
    return return_list