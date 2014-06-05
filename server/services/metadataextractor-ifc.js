var ExecutableService = require('../core/executable-service'),
    _ = require('underscore');


var MetadataExtractorIFC = module.exports = function(opts, logger) {
    ExecutableService.call(this, opts, logger);

}
_.extend(MetadataExtractorIFC.prototype, ExecutableService.prototype);

MetadataExtractorIFC.prototype.onStdOut = function(data, res) {
    console.log('[MetadataExtractorIFC:onStdOut] \n' + data);

    res.send({
    	command: this.opts,
    	output: data.toString()
    });
}

MetadataExtractorIFC.prototype.onStdErr = function(data, res) {
    console.log('[MetadataExtractorIFC:onStdErr] \n' + data);
}

MetadataExtractorIFC.prototype.onClose = function(code, res) {
    console.log('[MetadataExtractorIFC:onClose] exit code: ' + code);
}