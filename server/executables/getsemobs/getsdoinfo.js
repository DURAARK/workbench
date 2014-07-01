//var url = 'http://asev.l3s.uni-hannover.de:3000/sdoinfo';
//placeholder if down = https://dl.dropboxusercontent.com/u/985282/sdoinfo.json 

var http = require('http');  
 
var options = {
            host: 'asev.l3s.uni-hannover.de',   
            port: 3000,   
            path: '/sdoinfo'
};

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