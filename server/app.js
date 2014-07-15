'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var hbs = require('express-hbs');
var baucis = require('baucis');
// var rdf2json = require('./node-rdf2json/lib/rdf2json/node-rdf2json/index.js');
var sys = require('sys');
var fs = require('fs');
var url = require("url");
var multipart = require("multipart");
var ServiceProviderMixin = require('./core/service-provider-mixin/index.js');
var _config = require(__dirname + '/../package.json');
var Workbench = require('./core/workbench');
var SessionManager = require('./core/session-manager');

/* ----------------------------------------------------------------------------
 * Webserver setup
 * --------------------------------------------------------------------------*/

var formidable = require('formidable'),
    http = require('http'),
    util = require('util');

var router = express(),
    sessionManager = new SessionManager(),
    appRoot = __dirname,
    wwwRoot = path.join(appRoot, '../app');

router.configure(function() {
    router.set('port', process.env.PORT || 3000);

    router.set('view engine', 'handlebars');
    router.set('views', appRoot + '../router/scripts/views');
});

//for file upload
router.use(express.bodyParser({
    uploadDir: path.join(appRoot, '../server/uploads'),
    keepExtensions: true
})); //puts the parsed body in req.body

// mount static:
router.use(express.static(wwwRoot));
router.use(express.static(path.join(wwwRoot, '../.tmp')));

// mount index.html:
router.get('/', function(req, res) {
    res.sendfile(path.join(wwwRoot, '../app/index.html'));
}.bind(this));

router.post('/upload', function(req, res) {
    for (var idx = 0; idx < Object.keys(req.files).length; idx++) {
        var key = Object.keys(req.files)[idx];
        var file_info = req.files[key];

        sessionManager.addFile(file_info);
    };
});

http.createServer(router).listen(router.get('port'), function() {
    console.log('[App] Express router started on port: ' + router.get('port'));
    console.log('[App]     * appRoot: ' + appRoot);
    console.log('[App]     * wwwRoot: ' + wwwRoot);
});

/* ----------------------------------------------------------------------------
 * application setup
 * --------------------------------------------------------------------------*/

var workbench = new Workbench({
    router: router,
    config: '../package.json',
    sessionManager: sessionManager,
    appRoot: __dirname
});