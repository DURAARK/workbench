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
//var JSON 
/* ----------------------------------------------------------------------------
 * Webserver setup
 * --------------------------------------------------------------------------*/

var formidable = require('formidable'),
    http = require('http'),
    util = require('util')     ;

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);

    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '../app/scripts/views');
});


//for file upload
 app.use(express.bodyParser( {uploadDir: path.join(__dirname, '../server/uploads'), keepExtensions: true } )); //puts the parsed body in req.body
// app.post("*", function(req,res){
// 	res.end( JSON.stringify(req.files) + "+n" );
// } );



// mount static
app.use(express.static(path.join(__dirname, '../app')));
app.use(express.static(path.join(__dirname, '../.tmp')));
app.use(express.static(path.join(__dirname + '../app/modules/contrib/sdo')));


//TODO: make ajaxy
app.post('/upload',function(req,res){
    console.log('FIRST TEST: ' + JSON.stringify(req.files));
    console.log('second TEST: ' +req.files.theFile.name);
    fs.readFile(req.files.theFile.path, function (err, data) {
        var newPath = "/home/dagedv/Skrivebord/stuff/"+req.files.theFile.name;
        fs.writeFile(newPath, data, function (err) {
          res.send('/ POST OK');
        });
    });
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