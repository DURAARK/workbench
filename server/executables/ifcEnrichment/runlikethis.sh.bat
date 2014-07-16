#requires that the file /home/<user>/ifcEnrichment/enrichmentTriples.txt exists .. this seems to be where (some of the?) results are stored.
#java -jar -Xmx2048m ./server/executables/ifcEnrichment/ifcEnrichment.jar ./server/fixtures/repository/Duplex_A_20110907_optimized.ifc  ./server/output/  IFCPOSTALADDRESS
#java -jar -Xmx2048m ifcEnrichment.jar ../../../server/fixtures/repository/Duplex_A_20110907_optimized.ifc  ../../../server/output/  IFCPOSTALADDRESS > please_shut_up_ifcenrichment.txt

#After that we run IfcEnrichment.jar using node
node ifcEnrichmentListReader.js ../../../server/output/enrichmentTriples.txt
