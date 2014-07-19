var path = require('path'),
    formidable = require('formidable'),
    fs = require('fs'),
    humanize = require('humanize'),
    _ = require('underscore');

var SessionManager = module.exports = function(opts) {
    this._appRoot = opts.appRoot;
    this._sessions = opts.sessions;

    this._pendingUploads = 0;
}

function getFileSize(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats["size"];
    return humanize.filesize(fileSizeInBytes);
}

SessionManager.prototype.addFile = function(file_info) {
    console.log('[SessionManager::addFile] file_info:');
    console.log('    * name:                ' + file_info.name);
    console.log('    * type:                  ' + file_info.type);
    console.log('    * size:                   ' + file_info.size);
    console.log('    * location server: ' + file_info.path);

    if (file_info.session < this.getSessions().length) {
        var session = this.getSessions()[file_info.session];
        session.files.push({
            id: session.files.length,
            path: file_info.path,
            name: file_info.name,
            type: path.extname(file_info.path),
            size: getFileSize(file_info.path)
        });
    } else {
        throw Error('[SessionManager::addFile] No session with id "' + file_info.sessoin + '" found.');
    }
}

SessionManager.prototype.getSessions = function() {
    return this._sessions;
};

SessionManager.prototype.handleUpload = function(req, res) {
    var form = new formidable.IncomingForm(),
        pending_files = [];

    form.keepExtensions = true;
    form.uploadDir = path.join(this._appRoot, '../server/uploads');

    form.on('field', function(field, value) {
        if (field === 'session') {
            this.sessionId = value;

            this._pendingUploads++;
        }

        if (pending_files.length) {
            _.forEach(pending_files, function(file) {
                file.session = this.sessionId;
                this.addFile(file);
            }.bind(this))
        }
    }.bind(this));

    form.on('file', function(field, file) {
        // No upload of 0-length files
        // FIXXME: reflect this to the user!
        if (file.size === 0) {
            return;
        }

        if (this.sessionId) {
            file.session = this.sessionId;
            this.addFile(file);
        } else {
            pending_files.push(file);
        }
    }.bind(this));

    form.on('error', function(err) {
        console.log('[Workbench] An error has occured with form upload');
        console.log(err);
        req.resume();
    })

    form.on('aborted', function(err) {
        console.log('[Workbench] User aborted upload');
        // FIXXME: error code!
    });

    form.on('end', function() {
        this._pendingUploads--;
        console.log('[Workbench] upload done, pending: ' + this._pendingUploads);
    }.bind(this));

    form.parse(req);
};

SessionManager.prototype.getNumPendingUploads = function() {
    return this._pendingUploads;
};

SessionManager.prototype.getUploadState = function(req, res) {
    var id = req.param('id');

    console.log('query upload status for: ' + id);

    var that = this;

    function queryUploadStatus() {
        // FIXXME: search for requested session!
        var uploads = that.getNumPendingUploads();
        console.log('uploads: ' + uploads);

        if (uploads) {
            console.log('querying...');
            setTimeout(function() {
                queryUploadStatus(that.getNumPendingUploads());
            }, 1000);
        } else {
            console.log('upload done');
            res.json({
                status: 'done'
            });
        }
    }

    queryUploadStatus(this.getNumPendingUploads());
};