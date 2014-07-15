var SessionManager = require('./session-manager'),
    ServiceProviderMixin = require('./service-provider-mixin/index.js'),
    LoggerMixin = require('./logger-mixin'),
    _ = require('underscore'),
    express = require('express'),
    path = require('path'),
    formidable = require('formidable'),
    fs = require('fs');

var Workbench = module.exports = function(opts) {
    this._config = require(__dirname + '/../' + opts.config);
    this._appRoot = opts.appRoot;
    this._sessions = [];
    this._router = opts.router;
    this.log = opts.logger;

    this._sessionManager = new SessionManager();

    ServiceProviderMixin.call(this, this._router, {
        sessionManager: opts.sessionManager,
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

    this._sessions.push(session);

    if (session.options.demo_mode) {
        this._sessionManager.addFile({});
    }

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
};

Workbench.prototype.registerUploadService = function() {
    this._router.post('/upload', function(req, res) {
        var form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.uploadDir = path.join(this._appRoot, '../server/uploads');

        form.on('file', function(field, file) {
            //var dest_path = path.join(form.uploadDir, file.name);
            //fs.rename(file.path, dest_path);

            this._sessionManager.addFile({
                name: file.name,
                path: file.path
            });
        }.bind(this));

        form.on('error', function(err) {
            console.log('[Workbench] An error has occured with form upload');
            console.log(err);
            req.resume();
        })

        form.on('aborted', function(err) {
            console.log('[Workbench] User aborted upload');
        });

        form.on('end', function() {
            console.log('[Workbench] upload done');
        });

        form.parse(req, function() {
            // console.log('parsed')
        });
    }.bind(this));
};