var spawn = require('child_process').spawn,
    path = require('path');


var ExecutableFileOutputService = module.exports = function(opts, session_manager, logger) {
    this.opts = opts.interface.command;

    this.log = logger;
    if (!this.log) {
        this.log = require('npmlog');
    }
}

ExecutableFileOutputService.prototype.findById = function(req, res) {
    this.log.info('', '[ExecutableFileOutputService::findById] Query ID: "%s"', req.params.id);

    var id = req.params.id,
        inputparam = null;

    if (this.opts.input) {
        inputparam = this.opts.input;
    } else {
        // FIXXME: ask SessionManager for the filename corresponding to the id:
        inputparam = '/usr';
    }

    var exec_path = this.opts.name;
    if (path.resolve(exec_path) !== exec_path) {
        exec_path = path.join(__dirname, '../../', exec_path);
    }

    var current_cwd = process.cwd(),
        cwd = path.dirname(exec_path);

    process.chdir(cwd);

    var executable = spawn(exec_path, [this.opts.options, inputparam]);

    // executable.stdout.on('data', function(data) {
    //     this.onStdOut(data, res);
    // }.bind(this));

    executable.stderr.on('data', function(data) {
        process.chdir(current_cwd);
        if (this.onStdErr) {
            this.onStdErr(data, res);
        }
    }.bind(this));

    executable.on('close', function(code) {
        process.chdir(current_cwd);
        if (this.onClose) {
            this.onClose(code, this.opts, res);
        } else {
            console.log('Implement "onClose" method in your ExecutableService object!');
        }
    }.bind(this));
}