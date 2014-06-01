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
var ServiceProviderMixin = require('./core/service-provider-mixin/index.js');
var _config = require(__dirname + '/../package.json');
var Workbench = require('./core/workbench');

/* ----------------------------------------------------------------------------
 * Webserver setup
 * --------------------------------------------------------------------------*/

var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 3000);

	app.set('view engine', 'handlebars');
	app.set('views', __dirname + '../app/scripts/views');
});

// mount static
app.use(express.static(path.join(__dirname, '../app')));
app.use(express.static(path.join(__dirname, '../.tmp')));

// route index.html
app.get('/', function(req, res) {
	res.sendfile(path.join(__dirname, '../app/index.html'));
});

// set logging
app.use(function(req, res, next) {
	console.log('%s %s', req.method, req.url);
	next();
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
    config: '../package.json'
});