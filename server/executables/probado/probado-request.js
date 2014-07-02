
var request = require('request');

request.get('https://ogo.cgv.tugraz.at/api/Models?start=0&count=10', 
    function(error, response, body){
        console.log(body);
});
