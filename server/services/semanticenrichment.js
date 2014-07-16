var ConsoleService = require('../core/console-service'),
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path');

console.log('=== Invoking semanticenrichment.js');
var SemanticEnrichment = module.exports = function(opts, logger) {
    ConsoleService.call(this, opts, logger);
    this._outputDir = null;
}
_.extend(SemanticEnrichment.prototype, ConsoleService.prototype);


SemanticEnrichment.prototype.selectOptions = function(file_path, appRoot, options, inputparam) {
    this._outputDir = path.join(appRoot, 'output');
    var options = '-jar -Xmx1600m ' + options + ' ' + inputparam + ' ' + this._outputDir + ' IFCPOSTALADDRESS';
    return options.split(' ');
}

SemanticEnrichment.prototype.selectFile = function(session_id) {
    var sessions = this.getSessionManager().getSessions();

    if (session_id < sessions.length) {

        var file = _.find(sessions[session_id].files, function(file) {
            return file.type === 'ifc'
        });

        console.log('[BuildmIFC::selectFile] selected file: ' + file.path);

        return file.path;
    } else {
        return null;
    }
};

SemanticEnrichment.prototype.onStdErr = function(data, res) {
    console.log(data.toString());
}

// The 'onStdOut' method is called after the executable given in the 'package.json' file is executed.
// The 'output_info' is an object that contains information on where the created output file is located.
SemanticEnrichment.prototype.onStdOut = function(data, res) {
    console.log(data.toString());
}

SemanticEnrichment.prototype.onClose = function(code, res) {
    // 'output_info' contains information on the output file that was created by the command:
    console.log('[SemanticEnrichment:onClose] exit code: ' + code);

    var arr = [],
        jsonarray = [],
        filename = process.argv[2],
        limiter = 100; //TODO: Find better solution..

    require('fs').readFileSync(path.join(this._outputDir, 'enrichmentTriples.txt')).toString().split(/\r?\n/).forEach(function(line) {
        arr = line.split(",");
        //Dataset ID</td><td>Dataset name</td><td> Resource IDs</td><td> Resource URIs</td><td>
        // Property URIs</td><td> and Resource Values</td></tr>
        var items = {
            "dataset_id": arr[0],
            "dataset_name": arr[1],
            "resource_id": arr[2],
            "resource_uri": arr[3],
            "property_uri": arr[4],
            "resource_value": arr.slice(2, -1).join(' ')
        };
        // if ((line.length > 6) && (limiter > 0)) {
        if ((line.length > 6)) {
            jsonarray.push(items);
        };
        // limiter = limiter - 1;
    });

    res.json(jsonarray);
}