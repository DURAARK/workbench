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

var app = express(),
    sessionManager = new SessionManager();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);

    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '../app/scripts/views');
});


//for file upload
app.use(express.bodyParser({
    uploadDir: path.join(__dirname, '../server/uploads'),
    keepExtensions: true
})); //puts the parsed body in req.body


// mount static
app.use(express.static(path.join(__dirname, '../app')));
app.use(express.static(path.join(__dirname, '../.tmp')));
app.use(express.static(path.join(__dirname + '../app/modules/contrib/sdo')));


//TODO: make ajaxy
app.post('/upload', function(req, res) {
    console.log('FIRST TEST: ' + JSON.stringify(req.files));
    console.log('second TEST: ' + req.files.theFile.name);

    for (var idx = 0; idx < Object.keys(req.files).length; idx++) {
        var key = Object.keys(req.files)[idx];
        var file_info = req.files[key];

        sessionManager.addFile(file_info);
    };
});

// start server
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express App started!');

});

/* ----------------------------------------------------------------------------
 * Application setup
 * --------------------------------------------------------------------------*/

var app = new Workbench({
    router: app,
    config: '../package.json',
    sessionManager: sessionManager
});

console.log('Started server on port: ' + (process.env.PORT || 3000));