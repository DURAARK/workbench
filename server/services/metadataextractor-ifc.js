var ExecutableService = require('../core/executable-service'),
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path');


var MetadataExtractorIFC = module.exports = function(opts, logger) {
    ExecutableService.call(this, opts, logger);

}
_.extend(MetadataExtractorIFC.prototype, ExecutableService.prototype);

MetadataExtractorIFC.prototype.onStdErr = function(data, res) {
    console.log('[MetadataExtractorIFC:onStdErr] \n' + data);

    // 'this.opts' contains data about the executed command:
    res.send({
        command: this.opts,
        output: data.toString()
    });    
}

// The 'onClose' method is called after the executable given in the 'package.json' file is executed.
// The 'output_info' is an object that contains information on where the created output file is located.
MetadataExtractorIFC.prototype.onClose = function(code, output_info, res) {
    // 'output_info' contains information on the output file that was created by the command:
    console.log('[MetadataExtractorIFC:onClose] output_info: ' + JSON.stringify(output_info));

    var output_filepath = null;
    // If the 'output_info.output' filename is not absolute it is appended to the 
    // root path of the code repository:
    if (path.resolve(output_info.output) !== output_info.output) {
        var base_path = process.cwd(); // Returns the root path of the code repository
        var output_filepath = path.join(base_path, output_info.output); // 
    }

    console.log('file_path: ' + output_filepath);

    // Read output file into string. It's content is JSON here for demonstration purpose:
    var file = fs.readFileSync(output_filepath);

    // Here you can read the content of the file and process it to generate a (JSON) response.

    // I just put return some valid json here, as the created file is empty:
    var data = {
    	style: "Gothic",
    	address: "Lange Gasse 3"
    };

    // Return the files content together with the command information:
    res.send({
    	command: output_info,
    	content: data
    });

    // To simply return the (unprocessed) content of the file uncomment the following:
    // res.send({
    // 	command: output_info,
    // 	content: file.toString()
    // });    
}