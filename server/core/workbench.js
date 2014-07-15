var SessionManager = require('./session-manager'),
    FileIdentifier = require('./file-identifier'),
    ServiceProviderMixin = require('./service-provider-mixin/index.js'),
    LoggerMixin = require('./logger-mixin'),
    _ = require('underscore'),
    path = require('path');

var Workbench = module.exports = function(opts) {
    this._config = require(__dirname + '/../' + opts.config);
    this._appRoot = opts.appRoot;
    this._sessions = [];
    this._router = opts.router;
    this.log = opts.logger;

    this._sessionManager = new SessionManager({
        appRoot: this._appRoot,
        sessions: this._sessions
    });

    this._fileIdentifier = new FileIdentifier({
        appRoot: this._appRoot
    });

    ServiceProviderMixin.call(this, this._router, {
        sessionManager: this._sessionManager,
        appRoot: this._appRoot
    }, this.log);

    if (!this._router) {
        throw new Error('[Workbench::ctor] Option "webserver" has to be set! Aborting...');
    }

    if (!this.log) {
        this.log = require('npmlog');
    }

    this.registerUploadService();
    this.registerNewSessionService();
    this.registerFileIdService();
    this.registerEndpoints(this._config.services);
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

    if (session.options.demo_mode) {
        this.addDemoFiles(session);
    }

    this._sessions.push(session);

    return session;
};

Workbench.prototype.addDemoFiles = function(session) {
    this._sessionManager.addFile({
        name: 'CCO_DTU-Building127_Arch_CONF.ifc',
        path: path.join(this._appRoot, 'fixtures/repository/CCO_DTU-Building127_Arch_CONF.ifc'),
        type: 'ifc'
    });

    this._sessionManager.addFile({
        name: 'CCO_DTU-Building127_Arch_CONF.e57',
        path: path.join(this._appRoot, 'fixtures/repository/CCO_DTU-Building127_Arch_CONF.e57'),
        type: 'e57'
    });

    this._sessionManager.addFile({
        name: 'CCO_DTU-Building127_Arch_CONF.ttl',
        path: path.join(this._appRoot, 'fixtures/repository/CCO_DTU-Building127_Arch_CONF.ttl'),
        type: 'rdf'
    });

    session.files = this._sessionManager.getInfos();
};

Workbench.prototype.sessionManager = function() {
    return this._sessionManager;
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

Workbench.prototype.registerFileIdService = function() {
    this._router.get('/services/fileid', function(req, res) {
        res.json(this._sessions);
    }.bind(this));

    this._router.get('/services/fileid/:id', function(req, res) {
        console.log('identification: asdflkjasdlfkjasdfasdf');
        var id = req.param('id');
        if (id < this._sessions.length) {
            var files = this._sessions[id].files;
            if (files.length) {
                var e57_file = _.find(files, function(file) {
                    return file.type === 'e57'
                });

                this._fileIdentifier.identify(e57_file.path, function(info) {
                    info.format = info.format.replace(/(\r\n|\n|\r)/gm, "");

                    if (info.format === 'fmt/643') {
                        info['valid'] = true;
                        info['formatString'] = 'E57 (pointcloud)';
                    } else {
                        info['valid'] = false;
                    }

                    res.send(info);
                })
            } else {
                // FIXXME: return proper status code!
                res.send({});
            }
        } else {
            res.status(404).send('No session with id "' + id + '" is found');
        }
    }.bind(this));
};

Workbench.prototype.registerUploadService = function() {
    this._router.post('/upload', function(req, res) {
        this._sessionManager.handleUpload(req, res);
    }.bind(this));
};