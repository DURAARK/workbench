#requires that the file /home/<user>/ifcEnrichment/enrichmentTriples.txt exists .. this seems to be where (some of the?) results are stored.
java -jar -Xmx2048m ifcEnrichment.jar ../../fixtures/repository/Duplex_A_20110907_optimized.ifc IFCPOSTALADDRESS
