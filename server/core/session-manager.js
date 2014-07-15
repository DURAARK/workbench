var path = require('path'),
    formidable = require('formidable');

var SessionManager = module.exports = function(opts) {
    this._appRoot = opts.appRoot;
    this._fileInfos = [];
    // FIXXME: create and manage inside here!
    this._sessions = opts.sessions;
}

SessionManager.prototype.addFile = function(file_info) {
    console.log('[SessionManager::addFile] file_info:');
    console.log('    * name:               ' + file_info.name);
    console.log('    * type:               ' + file_info.type);
    console.log('    * location on server: ' + file_info.path);

    this._fileInfos.push({
        id: this._fileInfos.length,
        path: file_info.path,
        name: file_info.name,
        type: file_info.type
    });
}

SessionManager.prototype.getSessions = function() {
    return this._sessions;
};

SessionManager.prototype.getFileInfo = function(id) {
    console.log('[SessionManager::getFileInfo] id: ' + id);
    return this._fileInfos[id];
}

SessionManager.prototype.toJSON = function() {
    console.log('[SessionManager::toJSON] stored files: ' + this._fileInfos.length);
    return JSON.stringify(this._fileInfos);
}

SessionManager.prototype.getInfos = function() {
    console.log('[SessionManager::toJSON] stored files: ' + this._fileInfos.length);
    return this._fileInfos;
}

SessionManager.prototype.dump = function() {
    console.log('[SessionManager::dump] stored files: ' + this._fileInfos.length);

    for (var idx = 0; idx < this._fileInfos.length; idx++) {
        var file_info = this._fileInfos[idx];
        console.log('    * id: ' + file_info.id + ' / path: ' + file_info.path)
    };
}

SessionManager.prototype.handleUpload = function(req, res) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = path.join(this._appRoot, '../server/uploads');

    form.on('file', function(field, file) {
        //var dest_path = path.join(form.uploadDir, file.name);
        //fs.rename(file.path, dest_path);

        this.addFile({
            name: file.name,
            path: file.path
        });
    }.bind(this));

    form.on('error', function(err) {
        console.log('[Workbench] An error has occured with form upload');
        console.log(err);
        req.resume();
    })

    form.on('aborted', function(err) {
        console.log('[Workbench] User aborted upload');
    });

    form.on('end', function() {
        console.log('[Workbench] upload done');
    });

    form.parse(req, function() {
        // console.log('parsed')
    });
};