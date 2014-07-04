var spawn = require('child_process').spawn,
    path = require('path');


var SessionManagerService = module.exports = function(opts, session_manager, logger) {
    this.opts = opts;

    this.log = logger;
    if (!this.log) {
        this.log = require('npmlog');
    }

    this._session_manager = session_manager;
}

SessionManagerService.prototype.findAll = function(req, res) {
    this.log.info('', '[SessionManagerService::findAll] enter');

    var result = this._session_manager.toJSON();
    res.send(result);
}

SessionManagerService.prototype.findById = function(req, res) {
    this.log.info('', '[SessionManagerService::findById] requesting id: "%s"', req.params.id);

    var file_info = this._session_manager.getFileInfo(req.params.id);
    res.send(JSON.stringify(file_info));
}