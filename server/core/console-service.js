var spawn = require('child_process').spawn;


var ConsoleOutputService = module.exports = function(opts, logger) {
    this.opts = opts;

    this.log = logger;
    if (!this.log) {
        this.log = require('npmlog');
    }
}

ConsoleOutputService.prototype.findById = function(req, res) {
    this.log.info('', '[ConsoleOutputService::findById] Query ID: "%s"', req.params.id);

    var id = req.params.id,
        inputparam = null;

    if (this.opts.input) {
        inputparam = this.opts.input;
    } else {
        // FIXXME: ask SessionManager for the filename corresponding to the id:
        inputparam = '/usr';
    }

    var executable = spawn(this.opts.name, [this.opts.options, inputparam]);

    executable.stdout.on('data', function(data) {
        this.onStdOut(data, res);
    }.bind(this));

    executable.stderr.on('data', function(data) {
        this.onStdErr(data, res);
    }.bind(this));

    executable.on('close', function(code) {
        this.onClose(code, res);
    }.bind(this));
}