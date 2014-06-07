var spawn = require('child_process').spawn,
    path = require('path');


var ConsoleService = module.exports = function(opts, logger) {
    this.opts = opts;

    this.log = logger;
    if (!this.log) {
        this.log = require('npmlog');
    }
}

ConsoleService.prototype.findById = function(req, res) {
    // this.log.info('', '[ConsoleService::findById] Query ID: "%s"', req.params.id);

    var id = req.params['id'],
        inputparam = null;

    if (this.opts.input) {
        inputparam = this.opts.input;
    } else {
        // FIXXME: ask SessionManager for the filename corresponding to the id:
        inputparam = '/usr';
    }

    // If the command starts with './' we resolve to the absolute path:
    var exec_path = this.opts.name;
    if (this.opts.name.indexOf('./') === 0) {
        // If the 'output_info.output' filename is not absolute it is appended to the 
        // root path of the code repository:
        if (path.resolve(this.opts.name) !== this.opts.name) {
            var base_path = process.cwd(); // Returns the root path of the code repository
            var exec_path = path.join(base_path, this.opts.name); // 
        }
    }

    var current_cwd = process.cwd(),
        cwd = path.dirname(exec_path);

    process.chdir(cwd);

    // console.log('[ConsoleService::findById] about to spawn: ' + exec_path + ' ' + this.opts.options + ' ' + inputparam);

    var executable = spawn(exec_path, [this.opts.options, inputparam]);

    executable.stdout.on('data', function(data) {
        process.chdir(current_cwd);
        if (this.onStdOut) {
            this.onStdOut(data, res);
        } else {
            console.log('Implement "onStdOut" method in your ConsoleService object!');
        }
    }.bind(this));

    executable.stderr.on('data', function(data) {
        process.chdir(current_cwd);
        if (this.onStdErr) {
            this.onStdErr(data, res);
        }
    }.bind(this));

    executable.on('close', function(code) {
        if (this.onClose) {
            this.onClose(code, res);
        }
    }.bind(this));
}