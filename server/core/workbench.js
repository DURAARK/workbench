var ServiceProviderMixin = require('./service-provider-mixin/index.js'),
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

    this.registerNewSessionService();
    this.registerEndpoints(this._config.services);

    this._sessions = [];
}

_.extend(Workbench.prototype, ServiceProviderMixin.prototype);
_.extend(Workbench.prototype, LoggerMixin.prototype);

Workbench.prototype.addSession = function(config) {
    var session = {
        id: this._sessions.length,
        label: config.label,
        options: config.options,
        files: []
    };

    this._sessions.push(session);

    return session;
};

Workbench.prototype.registerNewSessionService = function() {
    this._router.post('/services/session', function(req, res) {
        var config = req.body;

        console.log('[Workbench] New session generated: "' + config.label + '"');

        var new_session = this.addSession(config);

        res.json(new_session);
    }.bind(this));

    this._router.get('/services/session', function(req, res) {
        res.json(this._sessions);
    }.bind(this));

    this._router.get('/services/session/:id', function(req, res) {
        var id = req.param('id');
        if (id < this._sessions.length) {
            res.json(this._sessions[id]);
        } else {
            res.status(404).send('No session with id "' + id + '" is found');
        }
    }.bind(this));
};