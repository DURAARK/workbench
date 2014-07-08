var request = require('request');

//what kind of work are we asked to do? List or Search (with a search-term).
var aParameter = process.argv[2];
var url = "https://ogo.cgv.tugraz.at/api/Models?" + aParameter;

request.get(url, 
    function(error, response, body){    	
    	body=body.replace(/<\?xml(.*?)<pos>/gm, ""); //No xml in our json!
    	body=body.replace(/<\/pos><\/Point>/gm, "");    	
    	var ja = JSON.parse(body);
    	var son = ja.resultItems; //we only want the resultItems part
    	var astring = JSON.stringify(son); 
        console.log(astring);
});
