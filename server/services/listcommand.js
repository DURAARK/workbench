var ConsoleService = require('../core/console-service'),
    _ = require('underscore');


var ListCommand = module.exports = function(opts, logger) {
    ConsoleService.call(this, opts, logger);

}
_.extend(ListCommand.prototype, ConsoleService.prototype);

ListCommand.prototype.onStdOut = function(data, res) {
    console.log('[ListCommand:onStdOut] \n' + data);

    res.send({
        command: this.opts,
        output: data.toString()
    });
}

ListCommand.prototype.onStdErr = function(data, res) {
    console.log('[ListCommand:onStdErr] \n' + data);

    res.send({
        command: this.opts,
        output: data.toString()
    });
}

ListCommand.prototype.onClose = function(code, res) {
    console.log('[ListCommand:onClose] exit code: ' + code);
}