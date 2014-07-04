
var request = require('request');

request.get('https://ogo.cgv.tugraz.at/api/Models?start=0&count=10', 
    function(error, response, body){    	
    	body=body.replace(/<\?xml(.*?)<pos>/gm, ""); //No xml in our json!
    	body=body.replace(/<\/pos><\/Point>/gm, "");    	
    	var ja = JSON.parse(body);
    	var son = ja.resultItems; //we only want the resultItems part
    	var astring = JSON.stringify(son); 
        console.log(astring);
});
