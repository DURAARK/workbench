var ServiceProviderMixin = require('./service-provider-mixin/index.js')
LoggerMixin = require('./logger-mixin'),
_ = require('underscore');

var Workbench = module.exports = function(opts) {
    this._config = require(__dirname + '/../' + opts.config);
    this._appRoot = opts.appRoot;

    this._router = opts.router;
    if (!this._router) {
        this.log.error('', '[Workbench::ctor] Option "webserver" has to be set! Aborting...');
        throw new Error('[Workbench::ctor] Option "webserver" has to be set! Aborting...');
    }

    this.log = opts.logger;
    if (!this.log) {
        this.log = require('npmlog');
    }

    ServiceProviderMixin.call(this, this._router, {
        sessionManager: opts.sessionManager,
        appRoot: this._appRoot
    }, this.log);

    this.registerEndpoints(this._config.services);
}

_.extend(Workbench.prototype, ServiceProviderMixin.prototype);
_.extend(Workbench.prototype, LoggerMixin.prototype);