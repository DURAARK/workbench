var arr = [];
var jsonarray = [];
var filename = process.argv[2];
var limiter = 10; //TODO: Find better solution..
require('fs').readFileSync(filename).toString().split(/\r?\n/).forEach(function(line){
  	arr = line.split(",");
        //Dataset ID</td><td>Dataset name</td><td> Resource IDs</td><td> Resource URIs</td><td>
        // Property URIs</td><td> and Resource Values</td></tr>
	var items = {
		"dataset_id": arr[0],
                "dataset_name": arr[1],
		"resource_id": arr[2],
		"resource_uri": arr[3],
                "property_uri": arr[4],               
                "resource_value": arr.slice(2,-1).join(' ')
	};
	if ( (line.length > 6) && (limiter>0) ){ 	
		jsonarray.push(items);
	};
	limiter = limiter -1;
});
console.log(JSON.stringify( jsonarray) ); //JSON.stringify deals with correct escaping of the key-strings that we created in items.
