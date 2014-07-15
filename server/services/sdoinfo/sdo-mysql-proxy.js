var mysql = require('mysql');

var SDOMySQLProxy = module.exports = function(opts, logger) {
    this.log = require('npmlog');
    this._opts = opts;
    this._db = null;

    this._dbpool = this._setupDBPool(opts);
}

SDOMySQLProxy.prototype._setupDBPool = function(opts) {
    console.log('[SDOMySQLProxy::+setupDBPool] server info:');
    console.log('    * host: ' + opts.host);
    console.log('    * user: ' + opts.user);
    console.log('    * db_name: ' + opts.db_name);
    console.log('    * port: ' + opts.port);

    var pool = mysql.createPool({
        connectionLimit: opts.connectionLimit || 1000,
        host: opts.host,
        user: opts.user,
        password: opts.password,
        port: opts.port
    });

    pool.getConnection(function(err, connection) {
        if (err) {
            console.log('', '[SDOMySQLProxy::_setupDBPool] Selected database: FAILURE\n', err);
            throw err;
        }

        this._dbpool = pool;

    }.bind(this));
}

SDOMySQLProxy.prototype.query = function(query, cb) {
    var db_name = this._opts.db_name;

    this._dbpool.getConnection(function(err, connection) {
        connection.query('USE ' + db_name, function(err, rows) {
            if (!err) {
                console.log('', '[SDOMySQLProxy::_setupDBPool] Selected database: OK [' + db_name + ']');
                connection.query(query, cb);
            } else {
                throw err;
            }
        });
    });
}

SDOMySQLProxy.prototype.findAll = function(req, res, query) {
    console.log('[SDOMySQLProxy::findAll] starting to handle request');

    this.query(query, function(err, rows) {
        if (err) {
            console.log('[SDOMySQLProxy::findAll] SQL query error: ' + err);
            res.send(err);
            throw err;
        }

        console.log('[SDOMySQLProxy::findAll] sending back processed rows...');

        res.send(rows);
    });
}