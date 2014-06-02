require(['put-selector/put', 'text!ifcm.rdf', 'text!buildm.rdf'], function(put, ifcm, buildm) {
	var writeInputs = function(turtle, formElement) {
		var s = new rdfstore.Store({}, function(store) {
			store.load("text/turtle", turtle, function(success, results) {
				store.execute(
					'PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> '    +
					'PREFIX owl:<http://www.w3.org/2002/07/owl#> '                 +
					'PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> '         +
					
					'SELECT $prop $label $range $comment WHERE { '                 +
						'{   { $prop rdf:type owl:ObjectProperty . } UNION'        +
							'{ $prop rdf:type owl:DatatypeProperty . } }'          +
						'$prop rdfs:label $label . '                               +
						'$prop rdfs:range $range . '                               +
						'OPTIONAL { '                                              +
							'$prop rdfs:comment $comment '                         +
						'}'                                                        +
					'}'
				, function(success, results) { 
					var shrink = function(uri) {
						var x = store.rdf.prefixes.shrink(uri);
						return x == uri ? [null, x] : x.split(':');
					};
					var previousName = null;
					results.map(function(record) {
						return {name   : record.prop.value.split('#')[1],
								label  : record.label.value,
								range  : shrink(record.range.value),
								comment: record.comment ? record.comment.value : null}                        
					}).forEach(function(record) {
						var range = (function(range) {
							if (range[0] === 'xsd') {
								switch(range[1]) {
									case 'string'  : return {type: 'text'               }
									case 'float'   : return {type: 'number', step: 'any'}
									case 'double'  : return {type: 'number', step: 'any'}
									case 'integer' : return {type: 'number', step: '1'  }
									case 'dateTime': return {type: 'date'               }
								}
							} else {
								return {type: 'url'}
							}
						})(record.range);
						if (previousName != record.name) {
							put(
								put(formElement, "tr td label", record.label).parentNode.parentNode, 
								"td input[type="+range.type+"]"+(
									range.step
										? "[step="+range.step+"]"
										: ""
								)+"[name="+record.name+"]"
							)
						}
						if (range.type === 'url') {
							put(formElement, "tr td[colspan=2][class=comment] a[href="+record.range[1]+"]", record.range[1])
						}
						if (record.comment) {
							put(formElement, "tr td[colspan=2][class=comment]", record.comment)
						}
						previousName = record.name;
					}); 
				});
			});
		});
	};
	writeInputs(ifcm, document.getElementById("ifcmTable"));
	writeInputs(buildm, document.getElementById("buildmTable"));
}); 