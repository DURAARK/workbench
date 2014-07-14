'use strict';

var MySQLProxy = require('./sdo-mysql-proxy');

var SDOInfoService = module.exports = function(opts, sessionManager, logger) {
    this.opts = opts.interface.command;
    this._sessionManager = sessionManager;

    this.log = logger;
    if (!this.log) {
        this.log = require('npmlog');
    }

    // DURAARK: Configure db access here:
    this.proxy = new MySQLProxy({
        host: '***REMOVED***',
        user: '***REMOVED***',
        password: '***REMOVED***',
        db_name: 'ld_dataset_crawler',
        port: 3307
    });
}

SDOInfoService.prototype.findAll = function(req, res) {
    this.log.info('', '[SDOInfoService::findAll] enter');

    var query = "SELECT DISTINCT dataset_name, dataset_url, dataset_description, c.crawl_date " +
        "FROM dataset d, dataset_crawl_log dcl, crawl_log c WHERE d.dataset_id = dcl.dataset_id AND dcl.crawl_id = c.crawl_id " +
        " ORDER BY d.dataset_name DESC";

    this.proxy.findAll(req, res, query);
}