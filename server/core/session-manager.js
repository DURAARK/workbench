var SessionManager = module.exports = function(opts, logger) {
    this._fileInfos = [];
}

SessionManager.prototype.addFile = function(file_info) {
    console.log('[SessionManager::addFile] filename: ' + file_info.path);

    this._fileInfos.push({
        id: this._fileInfos.length,
        path: file_info.path
    });
}

SessionManager.prototype.getFileInfo = function(id) {
    console.log('[SessionManager::getFileInfo] id: ' + id);
    return this._fileInfos[id];
}

SessionManager.prototype.toJSON = function() {
    console.log('[SessionManager::toJSON] stored files: ' + this._fileInfos.length);
    return JSON.stringify(this._fileInfos);
}

SessionManager.prototype.dump = function() {
    console.log('[SessionManager::dump] stored files: ' + this._fileInfos.length);

    for (var idx = 0; idx < this._fileInfos.length; idx++) {
        var file_info = this._fileInfos[idx];
        console.log('    * id: ' + file_info.id + ' / path: ' + file_info.path)
    };
}