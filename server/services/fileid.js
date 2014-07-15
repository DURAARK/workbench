var ConsoleService = require('../core/console-service'),
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path');

var FileId = module.exports = function(opts, logger) {
    ConsoleService.call(this, opts, logger);

}
_.extend(FileId.prototype, ConsoleService.prototype);

FileId.prototype.onStdErr = function(data, res) {
    console.log('[FileId:onStdErr] \n' + data.toString());

    // 'this.opts' contains data about the executed command:
    res.send({
        command: this.opts
        //output: data.toString()
    });
}

// The 'onStdOut' method is called after the executable given in the 'package.json' file is executed.
// The 'output_info' is an object that contains information on where the created output file is located.
FileId.prototype.onStdOut = function(data, res) {
    // 'output_info' contains information on the output file that was created by the command:
    console.log('[FileId:onStdOut] data: ' + data.toString()); //+ JSON.stringify(data.toString()));

    // Simply return the json string given in the output:
    res.send(data.toString());
}