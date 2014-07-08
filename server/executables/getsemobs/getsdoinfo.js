//var url = 'http://asev.l3s.uni-hannover.de:3000/sdoinfo';
//placeholder if down = https://dl.dropboxusercontent.com/u/985282/sdoinfo.json 

var http = require('http');  
var aParameter = process.argv[2];
//console.log("//aParameter = " + aParameter);

var options = {};
var gotList = aParameter.match(/^List/g);

//=== List ===
if(gotList){
	//console.log("gotList");
  options = {
            host: 'asev.l3s.uni-hannover.de',   
            port: 3000,   
            path: '/sdoinfo'
  };
};

//=== Search ===
var gotSearch = aParameter.match(/^Search/g);
if(gotSearch){
	//console.log("gotSearch");
	var topic = aParameter.split("=")[1]; //'Architecture'; //TODO: Make endogenious (split aParameter and keep the second part)
	//console.log("search term part is then:" + topic);
  options = {
 	host: 'data-observatory.org',   
      	port: 80,   
     	path: '/lod-profiles/sparql?default-graph-uri=http%3A%2F%2Fdata-observatory.org%2Flod-profiles%2Fprofiles-cat-level-2&query=SELECT+%3Fdataset+%3Flink+%3Fscore+%3Flink_1+%3Fentity+%3Fresource+WHERE+%7B%0D%0A%3Fdataset+a+void%3ALinkset.%0D%0A%3Fdataset+vol%3AhasLink+%3Flink.%0D%0A%3Flink+vol%3AlinksResource+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FCategory%3A' + topic + '%3E.%0D%0A%3Flink+vol%3AderivedFrom+%3Fentity.%0D%0A%3Flink+vol%3AhasScore+%3Fscore.%0D%0A%3Flink_1+vol%3AlinksResource+%3Fentity.%0D%0A%3Fdataset+vol%3AhasLink+%3Flink_1.%0D%0A%3Flink_1+vol%3AderivedFrom+%3Fresource%0D%0A%7D+%0D%0AORDER+BY+DESC%28%3Fscore%29%0D%0ALIMIT+100&format=application/json&timeout=0&debug=on'
  };
};

 
//var options = {
//            host: 'asev.l3s.uni-hannover.de',   
//            port: 3000,   
//            path: '/sdoinfo'
//};

http.get(options, function(res) {
  var body = '';
  res.on('data', function(chunk) {
    body += chunk;
  });
  res.on('end', function() {
    console.log(body);
  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
}); 
