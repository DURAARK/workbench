import sys
from ifc_query import *

load(sys.argv[1])

rdf_formatter(
    Single("IfcProject").GlobalId >> formatters.expand_guid,
    {   'xsd'        : '<http://www.w3.org/2001/XMLSchema#>'     ,
        'duraark'    : '<http://duraark.eu/voabularies/buildm#>' ,
        'dc'         : '<http://purl.org/dc/elements/1.1/>'      ,
        'dct'        : '<http://purl.org/dc/terms/>'             ,
        'dbpedia-owl': '<http://dbpedia.org/ontology/>'          ,
        'dbp-prop'   : '<http://dbpedia.org/property/>'          }
) << [
	
	Single("IfcProject").GlobalId >> "duraark:object_identifier",

    (Single("IfcProject").LongName | Single("IfcProject").Name) >> "foaf:name",
    
    Single("IfcProject").Description >> "dc:description",
    
    Single("IfcProject").OwnerHistory.CreationDate >> formatters.time
        >> ("dbp-prop:startDate", "dbpedia-owl:buildingStartYear"),
    
    Single("IfcProject").UnitsInContext.Units.filter(UnitType="LENGTHUNIT").Prefix +
        Single("IfcProject").UnitsInContext.Units.filter(UnitType="LENGTHUNIT").Name
        >> "duraark:length_unit",
        
    Multiple("IfcApplication").ApplicationDeveloper.Name + ' ' +
        Multiple("IfcApplication").ApplicationFullName + ' ' +
        Multiple("IfcApplication").Version
        >> "duraark:authoring_tool",
        
    (Single("IfcSite").RefLatitude >> formatters.latitude) +
        (Single("IfcSite").RefLongitude >> formatters.longitude)
        >> "foaf:based_near",
        
    Single("IfcBuilding").IsDecomposedBy.RelatedObjects >> formatters.count
        >> "duraark:floor_count",
        
    Multiple("IfcSpace") >> formatters.count >> "duraark:room_count",
    
    Single("IfcBuilding").BuildingAddress.AddressLines >> formatters.join
        >> "dbpedia-owl:address",
        
    Multiple("IfcOwnerHistory").OwningUser.ThePerson.GivenName + ' ' +
        Multiple("IfcOwnerHistory").OwningUser.ThePerson.FamilyName
        >> formatters.unique >> "dc:creator",
        
    RDF_REPOSITORIES >> "duraark:enrichment_vocabulary"
	
]
