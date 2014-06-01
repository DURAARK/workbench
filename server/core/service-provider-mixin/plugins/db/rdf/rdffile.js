var 	fs = require("fs");

var RDFFile = function(filename) {
	this.filename = filename;
}

RDFFile.prototype.toJSON = function() {
	return require(this.filename);
};

module.exports = RDFFile;