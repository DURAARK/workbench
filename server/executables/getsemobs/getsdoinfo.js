var http = require('http');  
var aParameter = process.argv[2];
var fs = require('fs'); //TODO: remove after debugging 

var options = {};

//=== List ===
var gotList = aParameter.match(/^List/g);
if(gotList){
  options = {
            host: 'asev.l3s.uni-hannover.de',   
            port: 3000,   
	    headers: {'If-Modified-Since': 'Sun, 06 Oct 2013 01:16:45 GMT'},   //So that we do not have to handle 304 content not changed
            path: '/sdoinfo'		
  };
};

//=== Search ===
var gotSearch = aParameter.match(/^Search/g);
if(gotSearch){
	var topic = aParameter.split("=")[1]; //'Architecture' for instance; 
  options = {
 	host: 'data-observatory.org',   
      	port: 80,
	headers: {'If-Modified-Since': 'Sun, 06 Oct 2013 01:16:45 GMT'},   //So that we do not have to handle 304 content not changed
     	path: '/lod-profiles/sparql?default-graph-uri=http%3A%2F%2Fdata-observatory.org%2Flod-profiles%2Fprofiles-cat-level-2&query=SELECT+%3Fdataset+%3Flink+%3Fscore+%3Flink_1+%3Fentity+%3Fresource+WHERE+%7B%0D%0A%3Fdataset+a+void%3ALinkset.%0D%0A%3Fdataset+vol%3AhasLink+%3Flink.%0D%0A%3Flink+vol%3AlinksResource+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FCategory%3A' + topic + '%3E.%0D%0A%3Flink+vol%3AderivedFrom+%3Fentity.%0D%0A%3Flink+vol%3AhasScore+%3Fscore.%0D%0A%3Flink_1+vol%3AlinksResource+%3Fentity.%0D%0A%3Fdataset+vol%3AhasLink+%3Flink_1.%0D%0A%3Flink_1+vol%3AderivedFrom+%3Fresource%0D%0A%7D+%0D%0AORDER+BY+DESC%28%3Fscore%29%0D%0ALIMIT+100&format=application/json&timeout=0&debug=on'
  };
};

http.get(options, function(res) {
  var body = '';
  res.on('data', function(chunk) {
    body += chunk;
  });
  res.on('end', function() {

	if(gotSearch){    
		var ja = JSON.parse(body);
	    	var son = ja.results.bindings; //we only want the results.bindings part
		son = son.slice(0, 10); //FIXME: attempt to see if possible timing problem is amended by shorter array?????
	    	var astring = JSON.stringify(son); 
		body = astring;
		body=body.replace(/\\\"/gm, "\"");  //no extra escape characters, please
	}
	//fs.writeFileSync('/home/dagedv/2nd_workbench-app/workbench-app/server/debug/sdo_' + new Date().toISOString() + '.json', body); 
        fs.writeFileSync('debug_sdo_search.json', body); //TODO: remove after debugged NB NB Identify underlying problem, some timing issue????
    	console.log(body);
  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
}); 
