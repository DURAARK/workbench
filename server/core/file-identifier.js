var spawn = require('child_process').spawn,
    path = require('path');

var FileIdentifier = module.exports = function(opts) {
    this._appRoot = opts.appRoot;
}

FileIdentifier.prototype.identify = function(file_path, cb) {
    console.log('[FileIdentifier::identify] input file: ' + file_path)

    var exec_path = 'java',
        droid_jar = path.join(this._appRoot, './executables/droid/droid-command-line-6.2.0-SNAPSHOT.jar'),
        signature_file = path.join(this._appRoot, './executables/droid/DROID_SignatureFile_V74.xml'),
        options = '-jar ' + droid_jar + ' -q -R -Nr ' + file_path + ' -Ns ' + signature_file;

    // console.log('[FileIdentifier::identify] About to execute: ' + exec_path + ' ' + options);

    var bla = options.split(' ');

    var executable = spawn(exec_path, bla);

    executable.stdout.on('data', function(data) {
        // console.log('OUTPUT: \n' + data.toString());
        // console.log('FILE:   \n' + file_path);
        // console.log('\n');

        if (data.toString().toLowerCase().indexOf(path.join(file_path).toLowerCase()) === 0) {
            var info = data.toString().split(',');

            var info = {
                name: path.basename(info[0]),
                format: info[1]
            };

            cb(info);

            console.log('[FileIdentifier::identify] Identified file "' + file_path + '"');
            console.log('     * type: ' + data.toString());
        }
    });

    executable.stderr.on('data', function(data) {
        console.log('[FileIdentifier::identify] Error executing: ' + exec_path + ' ' + options);
        console.log(data.toString());
    });
}

// var spawn = require('child_process').spawn,
//     path = require('path');


// var ExecutableFileOutputService = module.exports = function(opts, session_manager, logger) {
//     this.opts = opts.interface.command;
//     this._sessionManager = session_manager;
//     this._appRoot = opts.appRoot;

//     this.log = logger;
//     if (!this.log) {
//         this.log = require('npmlog');
//     }
// }

// ExecutableFileOutputService.prototype.getSessionManager = function() {
//     return this._sessionManager;
// };

// ExecutableFileOutputService.prototype.findById = function(req, res) {
//     this.log.info('', '[ExecutableFileOutputService::findById] Query ID: "%s"', req.params.id);

//     var id = req.params.id,
//         inputparam = null;

//     if (this.opts.input) {
//         inputparam = this.opts.input;
//     } else {
//         // FIXXME: ask SessionManager for the filename corresponding to the id:
//         inputparam = '/usr';
//     }

//     var exec_path = this.opts.name;
//     if (path.resolve(exec_path) !== exec_path) {
//         exec_path = path.join(__dirname, '../../', exec_path);
//     }

//     var current_cwd = process.cwd(),
//         cwd = path.dirname(exec_path);

//     process.chdir(cwd);

//     var executable = spawn(exec_path, [this.opts.options, inputparam]);

//     // executable.stdout.on('data', function(data) {
//     //     this.onStdOut(data, res);
//     // }.bind(this));

//     executable.stderr.on('data', function(data) {
//         process.chdir(current_cwd);
//         if (this.onStdErr) {
//             this.onStdErr(data, res);
//         }
//     }.bind(this));

//     executable.on('close', function(code) {
//         process.chdir(current_cwd);
//         if (this.onClose) {
//             this.onClose(code, this.opts, res);
//         } else {
//             console.log('Implement "onClose" method in your ExecutableService object!');
//         }
//     }.bind(this));
// }