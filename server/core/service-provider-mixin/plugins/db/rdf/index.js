// var mysql = require('mysql');
var RDFFile = require('./rdffile.js'),
    path = require('path');

var RDFPlugin = module.exports = function(opts, logger) {
    this.log = logger;
    // if (!this.log) {
    this.log = require('npmlog');
    // }

    this.opts = opts;

    // this._rdfFile = new RDFFile(this.opts.store);
    // this.log.info('[RDFPlugin::ctor] Initialized with filename: ' + this.opts.store);
}

RDFPlugin.prototype.findAll = function(req, res) {
    // this.log.info('', '[RDFPlugin::findAll] executed on ' + this.opts.store);

    // this._rdfFile.toJSON(function(json_data) {
    //     var parts = {
    //         parts: json_data
    //     };
    //     res.send(parts);
    // });

    if (this.opts.useFixtures) {
        // FIXXME: use approot()
        var rdffile = new RDFFile(path.join('../../../../../', this.opts.fixtureFile));
        res.send(rdffile.toJSON());
    }

    // res.send({
    //     filesize: 1243,
    //     version: 2.0
    // });
}

RDFPlugin.prototype.findById = function(req, res) {
    this.log.info('', '[RDFPlugin::findById] Query ID: "%s"', req.params.id);

    var id = req.params.id;

    if (this.opts.useFixtures) {
        // FIXXME: use approot()
        var rdffile = new RDFFile(path.join('../../../../../', this.opts.fixtureFile));
        res.send(rdffile.toJSON());
    }

    // res.send({
    //     filesize: 1243,
    //     version: 2.0
    // });
}