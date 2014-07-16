var ConsoleService = require('../core/console-service'),
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path');


var E57M = module.exports = function(opts, logger) {
    ConsoleService.call(this, opts, logger);
}
_.extend(E57M.prototype, ConsoleService.prototype);

E57M.prototype.selectFile = function(session_id) {
    var sessions = this.getSessionManager().getSessions();

    if (session_id < sessions.length) {

        var file = _.find(sessions[session_id].files, function(file) {
            return file.type === 'e57'
        });

        console.log('[BuildmIFC::selectFile] selected file: ' + file.path);

        return file.path;
    } else {
        return null;
    }
};

E57M.prototype.selectOptions = function(file_path, app_root) {
    this._outputFile = path.join(app_root, 'uploads', 'e57_tmp_output.json');
    var options = '--input ' + file_path + ' --output ' + this._outputFile;
    return options.split(' ');
};

E57M.prototype.onStdErr = function(data, res) {
    console.log('[E57M:onStdErr] \n' + data.toString());

    // 'this.opts' contains data about the executed command:
    res.send({
        command: this.opts
        //output: data.toString()
    });
}

// The 'onStdOut' method is called after the executable given in the 'package.json' file is executed.
// The 'output_info' is an object that contains information on where the created output file is located.
E57M.prototype.onClose = function(code, res) {
    // 'output_info' contains information on the output file that was created by the command:
    console.log('[E57M:onStdOut] exit code: ' + code);

    fs.readFile(this._outputFile, 'utf8', function(err, data) {
        if (err) {
            console.log('[E57M:onStdOut] error reading file: ' + err);
            return;
        }

        data = JSON.parse(data);

        var result = {
            scan_count: data.e57_metadata.scan_count,
            image_count: data.e57_metadata.image_count
        }

        console.dir(result);

        // Simply return the json string given in the output:
        res.json(result);
    });
}