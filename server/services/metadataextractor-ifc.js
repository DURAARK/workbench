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

    // Return the files content together with the command information:
    res.send({
    	command: output_info,
    	content: JSON.parse(file.toString())
    });
}