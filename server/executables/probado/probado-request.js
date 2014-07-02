
var request = require('request');

request.get('https://ogo.cgv.tugraz.at/api/Models?start=0&count=10', 
    function(error, response, body){
    	var ja = JSON.parse(body);
    	var son = ja.resultItems; //we only want the resultItems part
    	var astring = JSON.stringify(son); 
        console.log(astring);
});
