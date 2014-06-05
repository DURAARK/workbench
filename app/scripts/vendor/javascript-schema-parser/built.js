/**
 * @license RequireJS text 2.0.10 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */

define("text",["module"],function(e){var t,n,r,i,s,o=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],u=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,a=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,f=typeof location!="undefined"&&location.href,l=f&&location.protocol&&location.protocol.replace(/\:/,""),c=f&&location.hostname,h=f&&(location.port||undefined),p={},d=e.config&&e.config()||{};t={version:"2.0.10",strip:function(e){if(e){e=e.replace(u,"");var t=e.match(a);t&&(e=t[1])}else e="";return e},jsEscape:function(e){return e.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r").replace(/[\u2028]/g,"\\u2028").replace(/[\u2029]/g,"\\u2029")},createXhr:d.createXhr||function(){var e,t,n;if(typeof XMLHttpRequest!="undefined")return new XMLHttpRequest;if(typeof ActiveXObject!="undefined")for(t=0;t<3;t+=1){n=o[t];try{e=new ActiveXObject(n)}catch(r){}if(e){o=[n];break}}return e},parseName:function(e){var t,n,r,i=!1,s=e.indexOf("."),o=e.indexOf("./")===0||e.indexOf("../")===0;return s!==-1&&(!o||s>1)?(t=e.substring(0,s),n=e.substring(s+1,e.length)):t=e,r=n||t,s=r.indexOf("!"),s!==-1&&(i=r.substring(s+1)==="strip",r=r.substring(0,s),n?n=r:t=r),{moduleName:t,ext:n,strip:i}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/,useXhr:function(e,n,r,i){var s,o,u,a=t.xdRegExp.exec(e);return a?(s=a[2],o=a[3],o=o.split(":"),u=o[1],o=o[0],(!s||s===n)&&(!o||o.toLowerCase()===r.toLowerCase())&&(!u&&!o||u===i)):!0},finishLoad:function(e,n,r,i){r=n?t.strip(r):r,d.isBuild&&(p[e]=r),i(r)},load:function(e,n,r,i){if(i.isBuild&&!i.inlineText){r();return}d.isBuild=i.isBuild;var s=t.parseName(e),o=s.moduleName+(s.ext?"."+s.ext:""),u=n.toUrl(o),a=d.useXhr||t.useXhr;if(u.indexOf("empty:")===0){r();return}!f||a(u,l,c,h)?t.get(u,function(n){t.finishLoad(e,s.strip,n,r)},function(e){r.error&&r.error(e)}):n([o],function(e){t.finishLoad(s.moduleName+"."+s.ext,s.strip,e,r)})},write:function(e,n,r,i){if(p.hasOwnProperty(n)){var s=t.jsEscape(p[n]);r.asModule(e+"!"+n,"define(function () { return '"+s+"';});\n")}},writeFile:function(e,n,r,i,s){var o=t.parseName(n),u=o.ext?"."+o.ext:"",a=o.moduleName+u,f=r.toUrl(o.moduleName+u)+".js";t.load(a,r,function(n){var r=function(e){return i(f,e)};r.asModule=function(e,t){return i.asModule(e,f,t)},t.write(e,a,r,s)},s)}};if(d.env==="node"||!d.env&&typeof process!="undefined"&&process.versions&&!!process.versions.node&&!process.versions["node-webkit"])n=require.nodeRequire("fs"),t.get=function(e,t,r){try{var i=n.readFileSync(e,"utf8");i.indexOf("﻿")===0&&(i=i.substring(1)),t(i)}catch(s){r(s)}};else if(d.env==="xhr"||!d.env&&t.createXhr())t.get=function(e,n,r,i){var s=t.createXhr(),o;s.open("GET",e,!0);if(i)for(o in i)i.hasOwnProperty(o)&&s.setRequestHeader(o.toLowerCase(),i[o]);d.onXhr&&d.onXhr(s,e),s.onreadystatechange=function(t){var i,o;s.readyState===4&&(i=s.status,i>399&&i<600?(o=new Error(e+" HTTP status: "+i),o.xhr=s,r(o)):n(s.responseText),d.onXhrComplete&&d.onXhrComplete(s,e))},s.send(null)};else if(d.env==="rhino"||!d.env&&typeof Packages!="undefined"&&typeof java!="undefined")t.get=function(e,t){var n,r,i="utf-8",s=new java.io.File(e),o=java.lang.System.getProperty("line.separator"),u=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(s),i)),a="";try{n=new java.lang.StringBuffer,r=u.readLine(),r&&r.length()&&r.charAt(0)===65279&&(r=r.substring(1)),r!==null&&n.append(r);while((r=u.readLine())!==null)n.append(o),n.append(r);a=String(n.toString())}finally{u.close()}t(a)};else if(d.env==="xpconnect"||!d.env&&typeof Components!="undefined"&&Components.classes&&Components.interfaces)r=Components.classes,i=Components.interfaces,Components.utils["import"]("resource://gre/modules/FileUtils.jsm"),s="@mozilla.org/windows-registry-key;1"in r,t.get=function(e,t){var n,o,u,a={};s&&(e=e.replace(/\//g,"\\")),u=new FileUtils.File(e);try{n=r["@mozilla.org/network/file-input-stream;1"].createInstance(i.nsIFileInputStream),n.init(u,1,0,!1),o=r["@mozilla.org/intl/converter-input-stream;1"].createInstance(i.nsIConverterInputStream),o.init(n,"utf-8",n.available(),i.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER),o.readString(n.available(),a),o.close(),n.close(),t(a.value)}catch(f){throw new Error((u&&u.path||"")+": "+f)}};return t}),define("text!ifcm.rdf",[],function(){return'# baseURI: http://duraark.eu/vocabularies/ifcm\r\n# imports: http://bloody-byte.net/rdf/dc_owl2dl/dcmitype.ttl\r\n# imports: http://purl.org/dc/terms/\r\n# imports: http://www.loc.gov/premis/rdf/v1\r\n# imports: http://www.w3.org/2004/02/skos/core\r\n# imports: http://www.w3.org/TR/prov-o/\r\n\r\n@prefix : <http://duraark.eu/vocabularies/ifcm#> .\r\n@prefix owl: <http://www.w3.org/2002/07/owl#> .\r\n@prefix premisowl: <http://www.loc.gov/premis/rdf/v1#> .\r\n@prefix provo: <http://www.w3.org/TR/prov-o#> .\r\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\r\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\r\n@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\r\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\r\n\r\n<http://duraark.eu/vocabularies/ifcm>\r\n	rdf:type owl:Ontology ;\r\n	owl:imports <http://bloody-byte.net/rdf/dc_owl2dl/dcmitype.ttl> ,\r\n		<http://www.w3.org/TR/prov-o/> , <http://www.w3.org/2004/02/skos/core> ,\r\n		<http://purl.org/dc/terms/> , <http://www.loc.gov/premis/rdf/v1> ;\r\n	owl:versionInfo "Initital draft M12"^^xsd:string .\r\n	\r\n:IFCCharacteristics\r\n	rdf:type owl:Class ;\r\n	rdfs:comment "A domain specific PREMIS ObjectCharacteristics extension that\r\n		describes File entities of the Industry Foundation Classes in their part\r\n		21 STEP Physical File Format (SPFF)"^^xsd:string ;\r\n	rdfs:label "IFC Characteristics"^^xsd:string ;\r\n	rdfs:subClassOf premisowl:ObjectCharacteristicsExtension ;\r\n	skos:prefLabel "IFC Characteristics"^^xsd:string .\r\n	\r\n:LODmetric\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment "a percentage ratio that determines the number of object per\r\n		quibical meter"^^xsd:string ;\r\n	rdfs:label "LODmetric"^^xsd:string ;\r\n	rdfs:range xsd:float .\r\n	\r\n:attributeMetric\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment "the percentage of the OPTIONAL schema-level attributes that\r\n		have are provied with values in this file"^^xsd:string ;\r\n	rdfs:domain :IFCCharacteristics ;\r\n	rdfs:label "attribute metric"^^xsd:string ;\r\n	rdfs:range xsd:float .\r\n	\r\n:componentLibaries\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment "name of external component library that has been used. Can be\r\n		instantiated multiple times"^^xsd:string ;\r\n	rdfs:domain :IFCCharacteristics ;\r\n	rdfs:label "component libaries"^^xsd:string ;\r\n	rdfs:range xsd:string .\r\n	\r\n:creationTime\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment "timestamp of the generation of this file from the header\r\n		"^^xsd:string ;\r\n	rdfs:label "creation time"^^xsd:string ;\r\n	rdfs:range xsd:dateTime .\r\n	\r\n:ifcVersion\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment "The version of the IFC file. Can be extracted from the header\r\n		e.g. FILE_SCHEMA ((’IFC2X3’)). Will be IFC2x3 most of the times by the\r\n	time of this initial version"^^xsd:string ;\r\n	rdfs:domain :IFCCharacteristics ;\r\n	rdfs:label "has IFC version"^^xsd:string ;\r\n	rdfs:range xsd:string .\r\n	\r\n:implemenationLevel\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment "The implementation level according to the ISO 10303:21, most\r\n		often this will be ’2;1’"^^xsd:string ;\r\n	rdfs:domain :IFCCharacteristics ;\r\n	rdfs:label "implemenation level"^^xsd:string ;\r\n	rdfs:range xsd:string .\r\n	\r\n:lastProducingApplication\r\n	rdf:type owl:ObjectProperty ;\r\n	rdfs:comment "the LAST Software application that has been involved in\r\n		creating this model. In contrast to teh producingApplication property,\r\n		this information should be taken from the header"^^xsd:string ;\r\n	rdfs:domain :IFCCharacteristics ;\r\n	rdfs:label "originating application"^^xsd:string ;\r\n	rdfs:range <http://purl.org/dc/dcmitype/Software> .\r\n	\r\n:mvd rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment "the Model View Definition this file complies to. Can be\r\n		extracted from the FILE_DESCRIPTION section in the SPFF\r\n	header"^^xsd:string ;\r\n	rdfs:label "has MVD"^^xsd:string ;\r\n	rdfs:range xsd:string .\r\n	\r\n:numberComponents\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment "The number of IfcProduct subtypes that have been instantiated\r\n		(doors, windows, roofs, walls etc)"^^xsd:string ;\r\n	rdfs:domain :IFCCharacteristics ;\r\n	rdfs:label "number or products"^^xsd:string ;\r\n	rdfs:range xsd:integer .\r\n\r\n:numberEntities\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment ""^^xsd:string ;\r\n	rdfs:domain :IFCCharacteristics ;\r\n	rdfs:label "number entities"^^xsd:string ;\r\n	rdfs:range xsd:integer .\r\n	\r\n:producingApplication\r\n	rdf:type owl:ObjectProperty ;\r\n	rdfs:comment "one of the software application that has been involved in\r\n		creating this model. This information can be extracted on a per-object\r\n		record from the asscociated IfcOwnerHistory record. In theory. In\r\n		practice this provenance metadata record is not used to its intended\r\n		purpose in most implementing applications."^^xsd:string ;\r\n	rdfs:domain :IFCCharacteristics ;\r\n	rdfs:label "producing Application"^^xsd:string ;\r\n	rdfs:range <http://purl.org/dc/dcmitype/Software> .\r\n	\r\npremisowl:ObjectCharacteristicsExtension\r\n	rdf:type owl:Class ;\r\n	rdfs:comment "A Container Class to implement domain-specific\r\n		extensions"^^xsd:string ;\r\n	rdfs:label "Object characteristics extension"^^xsd:string ;\r\n	rdfs:subClassOf premisowl:ObjectCharacteristics ;\r\n	skos:prefLabel "Object characteristics extension"^^xsd:string .\r\n	\r\n	'}),define("text!buildm.rdf",[],function(){return'# baseURI: http://duraark.eu/vocabularies/buildm\r\n# imports: http://purl.org/dc/elements/1.1/\r\n# imports: http://purl.org/dc/terms/\r\n# imports: http://qudt.org/schema/qudt\r\n# imports: http://qudt.org/vocab/unit\r\n# imports: http://www.geonames.org/ontology\r\n# imports: http://www.qudt.org/qudt/owl/1.0.0/quantity.owl\r\n# imports: http://www.w3.org/TR/owl-time\r\n# imports: http://www.w3.org/ns/regorg\r\n\r\n@prefix : <http://duraark.eu/vocabularies/buildm#> .\r\n@prefix owl: <http://www.w3.org/2002/07/owl#> .\r\n@prefix qudt: <http://qudt.org/schema/qudt#> .\r\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\r\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\r\n@prefix regorg: <http://www.w3.org/ns/regorg#> .\r\n@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\r\n@prefix time: <http://www.w3.org/2006/time#> .\r\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\r\n\r\n<http://duraark.eu/vocabularies/buildm>\r\n	rdf:type owl:Ontology ;\r\n	owl:imports <http://purl.org/dc/terms/> ,\r\n		<http://www.qudt.org/qudt/owl/1.0.0/quantity.owl> ,\r\n		<http://qudt.org/schema/qudt> , <http://www.geonames.org/ontology> ,\r\n		<http://www.w3.org/TR/owl-time> , <http://www.w3.org/ns/regorg> ,\r\n		<http://purl.org/dc/elements/1.1/> , <http://qudt.org/vocab/unit> ;\r\n	owl:versionInfo "Created with TopBraid Composer"^^xsd:string .\r\n	\r\n:AreaUnit_1\r\n	rdf:type qudt:AreaUnit ;\r\n	rdfs:comment ""^^xsd:string ;\r\n	rdfs:label "Area unit 1"^^xsd:string ;\r\n	skos:prefLabel "Area unit 1"^^xsd:string .\r\n\r\n:Building\r\n	rdf:type owl:Class ;\r\n	rdfs:label "DURAARK Building"^^xsd:string ;\r\n	rdfs:subClassOf owl:Thing ;\r\n	skos:definition "The DURAARK Building class is a domain-specific concept to\r\n		capture descripte metadata about artefacts of the built enironement. It\r\n		is desgigned to be used in the context of archival systems, especially\r\n		such systems that are capable of storing Building Information Models\r\n		(BIM) in archives for the purpose of Digital Longterm Preservation\r\n		(DLP). In particular, this vocabulary has been designed to capture\r\n		information that can be explicitly extracted or inferred from\r\n		information residing in Industry Foundation Classes (IFC)\r\n		models."^^xsd:string ;\r\n	skos:prefLabel "Buidling"^^xsd:string .\r\n\r\n:constructionDateEnd\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment "The year of completion of the initial construction.\r\n		"^^xsd:string ;\r\n	rdfs:label "construction date"^^xsd:string ;\r\n	skos:prefLabel "construction date"^^xsd:string .\r\n\r\n:constructionTime\r\n	rdf:type owl:ObjectProperty ;\r\n	rdfs:comment ""^^xsd:string ;\r\n	rdfs:label "construction time"^^xsd:string ;\r\n	rdfs:range time:ProperInterval ;\r\n	skos:example "The construction of the Cologne Cathedral was started in 1248\r\n		and finished in 1880"^^xsd:string ;\r\n	skos:prefLabel "construction time"^^xsd:string .\r\n\r\n:hasOwner\r\n	rdf:type owl:ObjectProperty ;\r\n	rdfs:comment ""^^xsd:string ;\r\n	rdfs:label "has owner"^^xsd:string ;\r\n	rdfs:range <http://www.w3.org/ns/RegisteredOrganization> ;\r\n	skos:prefLabel "has owner"^^xsd:string .\r\n\r\n:has_Location\r\n	rdf:type owl:ObjectProperty ;\r\n	rdfs:comment ""^^xsd:string ;\r\n	rdfs:label "has Location"^^xsd:string ;\r\n	rdfs:range <http://purl.org/dc/terms/Location> ,\r\n		<http://www.geonames.org/ontology#Country> ;\r\n	skos:prefLabel "has Location"^^xsd:string .\r\n\r\n:has_building_area\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment "the gross floor according to local quantification method\r\n		(Depends on legal etc. practises)"^^xsd:string ;\r\n	rdfs:domain :Building ;\r\n	rdfs:label "has building area"^^xsd:string ;\r\n	rdfs:range xsd:double ;\r\n	skos:prefLabel "has gross floor area"^^xsd:string .\r\n\r\n:has_function\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment ""^^xsd:string ;\r\n	rdfs:domain :Building ;\r\n	rdfs:label "has function"^^xsd:string ;\r\n	rdfs:range xsd:string ;\r\n	skos:prefLabel "has function"^^xsd:string .\r\n\r\n:has_name\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment ""^^xsd:string ;\r\n	rdfs:domain :Building ;\r\n	rdfs:label "buildingname"^^xsd:string ;\r\n	rdfs:range xsd:string ;\r\n	skos:example "\\"Vertigo Building TU Eindhoven\\"; \\"Cologne\r\n		cathedral\\""^^xsd:string ;\r\n	skos:prefLabel "buildingname"^^xsd:string .\r\n\r\n:lengthUnit\r\n	rdf:type owl:ObjectProperty ;\r\n	rdfs:comment "Determines in which unit other properties are interpreted,\r\n		e.g. qudt:SquareMeter"^^xsd:string ;\r\n	rdfs:domain :Building ;\r\n	rdfs:label "length unit"^^xsd:string ;\r\n	rdfs:range qudt:AreaUnit ;\r\n	skos:prefLabel "length unit"^^xsd:string .\r\n\r\n:modificationDate\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment ""^^xsd:string ;\r\n	rdfs:domain :Building ;\r\n	rdfs:label "modification date"^^xsd:string ;\r\n	rdfs:range xsd:dateTime ;\r\n	skos:prefLabel "modification date"^^xsd:string .\r\n\r\n:numberFloor\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment ""^^xsd:string ;\r\n	rdfs:label "number of floors"^^xsd:string ;\r\n	rdfs:range xsd:integer ;\r\n	skos:prefLabel "number of floors"^^xsd:string .\r\n\r\n:numberRoom\r\n	rdf:type owl:DatatypeProperty ;\r\n	rdfs:comment "The number of all rooms in the builing "^^xsd:string ;\r\n	rdfs:label "number room"^^xsd:string ;\r\n	rdfs:range xsd:integer ;\r\n	skos:prefLabel "number room"^^xsd:string .\r\n	'}),require(["put-selector/put","text!ifcm.rdf","text!buildm.rdf"],function(e,t,n){var r=function(t,n){var r=new rdfstore.Store({},function(r){r.load("text/turtle",t,function(t,i){r.execute("PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX owl:<http://www.w3.org/2002/07/owl#> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> SELECT $prop $label $range $comment WHERE { {   { $prop rdf:type owl:ObjectProperty . } UNION{ $prop rdf:type owl:DatatypeProperty . } }$prop rdfs:label $label . $prop rdfs:range $range . OPTIONAL { $prop rdfs:comment $comment }}",function(t,i){var s=function(e){var t=r.rdf.prefixes.shrink(e);return t==e?[null,t]:t.split(":")},o=null;i.map(function(e){return{name:e.prop.value.split("#")[1],label:e.label.value,range:s(e.range.value),comment:e.comment?e.comment.value:null}}).forEach(function(t){var r=function(e){if(e[0]!=="xsd")return{type:"url"};switch(e[1]){case"string":return{type:"text"};case"float":return{type:"number",step:"any"};case"double":return{type:"number",step:"any"};case"integer":return{type:"number",step:"1"};case"dateTime":return{type:"date"}}}(t.range);o!=t.name&&e(e(n,"tr td label",t.label).parentNode.parentNode,"td input[type="+r.type+"]"+(r.step?"[step="+r.step+"]":"")+"[name="+t.name+"]"),r.type==="url"&&e(n,"tr td[colspan=2][class=comment] a[href="+t.range[1]+"]",t.range[1]),t.comment&&e(n,"tr td[colspan=2][class=comment]",t.comment),o=t.name})})})})};r(t,document.getElementById("ifcmTable")),r(n,document.getElementById("buildmTable"))}),define("main",function(){});