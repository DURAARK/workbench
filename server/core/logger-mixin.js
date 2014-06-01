var LoggerMixin= module.exports = function(logger) {
	this.logger = logger;
}

LoggerMixin.prototype.logger = function() {
	if (!this._logger) {
		this._logger = require('npmlog');
	}

	return this._logger;
}