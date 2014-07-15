var spawn = require('child_process').spawn,
    path = require('path');


var ConsoleService = module.exports = function(opts, sessionManager, logger) {
    this.opts = opts.interface.command;
    this._sessionManager = sessionManager;
    this._appRoot = opts.appRoot;

    this.log = logger;
    if (!this.log) {
        this.log = require('npmlog');
    }
}

ConsoleService.prototype.getSessionManager = function() {
    return this._sessionManager;
};

ConsoleService.prototype.selectFile = function(session_id) {
    throw Error('[ConsoleService::selectFile] IMPLEMENT IN DERIVED OBJECT!');
};

ConsoleService.prototype.findById = function(req, res) {
    // this.log.info('', '[ConsoleService::findById] Query ID: "%s"', req.params.id);

    var session_id = req.params['id'],
        inputparam = null;

    var file_path = this.selectFile(session_id);
    if (!file_path) {
        res.status(404).send('Could not find file');
    }

    // this.getSessionManager().dump();

    // console.log('working on: ' + file_path);
    inputparam = file_path;

    // If the command starts with './' we resolve to the absolute path:
    var exec_path = this.opts.name;
    if (this.opts.name.indexOf('./') === 0) {
        // Append an relative executable path to the appRoot:
        if (path.resolve(this.opts.name) !== this.opts.name) {
            var exec_path = path.join(this._appRoot, '..', this.opts.name);
        }
    }

    var current_cwd = process.cwd(),
        cwd = path.dirname(exec_path),
        // FIXXME: distinct between a path as option and an ordinary option,
        // so that the path can be made absolute to remove ambiguities!
        // This works for our current use of the console-service, but will
        // fail if a developer uses an ordinary option or a combination of
        // path and option!
        options = path.join(this._appRoot, '..', this.opts.options);

    process.chdir(cwd);

    console.log('[ConsoleService::findById] running in directory: ' + cwd);
    console.log('[ConsoleService::findById] about to spawn: ' + exec_path + ' ' + options + ' ' + inputparam);

    var executable = spawn(exec_path, [options, inputparam]);

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