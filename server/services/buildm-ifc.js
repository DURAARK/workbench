var ConsoleService = require('../core/console-service'),
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path');


var BuildmIFC = module.exports = function(opts, logger) {
    ConsoleService.call(this, opts, logger);
}
_.extend(BuildmIFC.prototype, ConsoleService.prototype);

BuildmIFC.prototype.selectFile = function(session_id, appRoot) {
    var sessions = this.getSessionManager().getSessions();

    if (session_id < sessions.length) {

        var file = _.find(sessions[session_id].files, function(file) {
            return file.type === 'ifc'
        });

        var abs_file_path = path.join(appRoot, file.path);

        console.log('[BuildmIFC::selectFile] selected file: ' + abs_file_path);

        return abs_file_path;
    } else {
        return null;
    }
};

BuildmIFC.prototype.onStdErr = function(data, res) {
    console.log('[BuildmIFC:onStdErr] \n' + data.toString());

    // 'this.opts' contains data about the executed command:
    res.send({
        command: this.opts
        //output: data.toString()
    });
}

// The 'onStdOut' method is called after the executable given in the 'package.json' file is executed.
// The 'output_info' is an object that contains information on where the created output file is located.
BuildmIFC.prototype.onStdOut = function(data, res) {
    // 'output_info' contains information on the output file that was created by the command:
    console.log('[BuildmIFC:onStdOut] data: ' + JSON.stringify(data.toString()));

    // Simply return the json string given in the output:
    res.send(JSON.stringify({
        rdf: data.toString()
    }));
}