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
        abs_file_path = path.join(this._appRoot, file_path),
        options = '-jar ' + droid_jar + ' -q -R -Nr ' + abs_file_path + ' -Ns ' + signature_file;

    // console.log('[FileIdentifier::identify] About to execute: ' + exec_path + ' ' + options);

    var bla = options.split(' ');

    var executable = spawn(exec_path, bla);

    executable.stdout.on('data', function(data) {
        // console.log('OUTPUT: \n' + data.toString());
        // console.log('FILE:   \n' + file_path);
        // console.log('\n');

        // if (data.toString().toLowerCase().indexOf(path.join(file_path).toLowerCase()) === 0) {
        if (data.toString().indexOf('.e57,fmt') > -1) {
            var info = data.toString().split(',');

            var info = {
                name: path.basename(info[0]),
                format: info[1].replace(/(\r\n|\n|\r)/gm, "")
            };

            cb(info);

            console.log('[FileIdentifier::identify] Identified file "' + file_path + '"');
            console.log('     * type: ' + data.toString());
        }
    });

    executable.stderr.on('data', function(data) {
        console.log(exec_path + ' ' + options);
        console.log(data.toString());
    });
}
