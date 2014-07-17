var SessionManager = require('./session-manager'),
    FileIdentifier = require('./file-identifier'),
    ServiceProviderMixin = require('./service-provider-mixin/index.js'),
    LoggerMixin = require('./logger-mixin'),
    _ = require('underscore'),
    path = require('path'),
    fs = require('fs');

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

    this.loadSessions(this._config.sessions);

    // FIXXME: temporary solution until e57Extract is linux compatible:
    this.registerE57Extractor();
}

_.extend(Workbench.prototype, ServiceProviderMixin.prototype);
_.extend(Workbench.prototype, LoggerMixin.prototype);

Workbench.prototype.registerE57Extractor = function() {
    this._router.get('/services/e57m/:id', function(req, res) {
        var outputFile = path.join(this._appRoot, 'uploads', 'e57_tmp_output.json');
        fs.readFile(outputFile, 'utf8', function(err, data) {
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
    }.bind(this));
};

Workbench.prototype.loadSessions = function(sessions) {
    _.forEach(sessions, function(session) {
        this._sessions.push(session);
    }.bind(this));
};

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

    this._router.delete('/services/session/:id', function(req, res) {
        var id = req.param('id');

        var len = this._sessions.length;
        console.log('length davor: ' + len);

        this._sessions = _.reject(this._sessions, function(session) {
            return session.id !== id;
        });

        console.log('length danach: ' + this._sessions.length);

        if (len === (this._sessions.length - 1)) {
            res.status(200);
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
        var id = req.param('id');
        if (id < this._sessions.length) {
            var files = this._sessions[id].files;
            if (files.length) {
                var e57_file = _.find(files, function(file) {
                    return file.type === 'e57'
                });

                this._fileIdentifier.identify(e57_file.path, function(info) {
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