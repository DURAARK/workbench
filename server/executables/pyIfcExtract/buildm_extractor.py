import sys
from ifc import *

load(sys.argv[1])

# json_formatter << [
rdf_formatter(Single("IfcProject").GlobalId() >> formatters.expand_guid) << [
	
	Single("IfcProject").GlobalId() >> "Digital_Object_Identifier",

    (Single("IfcProject").LongName() | Single("IfcProject").Name()) >> "Digital_Object_Name",
    
    Single("IfcProject").Description() >> "Digital_Object_Description",
    
    Single("IfcProject").OwnerHistory().CreationDate() >> formatters.time >> "Digital_Object_Created",
    
    Single("IfcProject").UnitsInContext().Units().Filter(UnitType="LENGTHUNIT").Prefix() +
        Single("IfcProject").UnitsInContext().Units().Filter(UnitType="LENGTHUNIT").Name()
        >> "Digital_Object_Length_Unit",
        
    Multiple("IfcApplication").ApplicationDeveloper().Name() + ' ' +
        Multiple("IfcApplication").ApplicationFullName() + ' ' +
        Multiple("IfcApplication").Version()
        >> "Digital_Object_Authoring_Tool",
        
    (Single("IfcSite").RefLatitude() >> formatters.latitude) +
        (Single("IfcSite").RefLongitude() >> formatters.longitude)
        >> "Physical_Asset_Location",
        
    Single("IfcBuilding").IsDecomposedBy().RelatedObjects() >> formatters.count
        >> "Physical_Asset_Number_of_Floors",
        
    Multiple("IfcSpace") >> formatters.count >> "Physical_Asset_Number_of_Rooms",
    
    Single("IfcBuilding").BuildingAddress().AddressLines() >> formatters.join
        >> "Physical_Asset_Address",
        
    Multiple("IfcOwnerHistory").OwningUser().ThePerson().GivenName() + ' ' +
        Multiple("IfcOwnerHistory").OwningUser().ThePerson().FamilyName()
        >> formatters.unique >> "Physical_Asset_Creator",
        
    RDF_REPOSITORIES >> "Digital_Object_Repositories_Used"
	
]
