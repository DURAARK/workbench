var ServiceProviderMixin = require('./service-provider-mixin/index.js')
	LoggerMixin = require('./logger-mixin'),
	_ = require('underscore');

var Workbench = module.exports = function(opts) {
	this._config = require(__dirname + '/../' + opts.config);

	this._router = opts.router;
	if (!this._router) {
		this.log.error('', '[Workbench::ctor] Option "webserver" has to be set! Aborting...');
		throw new Error('[Workbench::ctor] Option "webserver" has to be set! Aborting...');
	}

	this.log = opts.logger;
	if (!this.log) {
		this.log = require('npmlog');
	}

	ServiceProviderMixin.call(this, this._router, this._config.endpoints, this.log);

	// FIXXME: introduce own state object!
	this._state = this._router;

	/* ----------------------------------------------------------------------------
	 * State setup
	 * --------------------------------------------------------------------------*/

	var settings = _.extend(this._config.app.settings, {
		appRoot: __dirname + '/../..'
	});

	this.setupState(settings);
	this.registerEndpoints(this._config.endpoints);

	/* ----------------------------------------------------------------------------
	 * Router setup
	 * --------------------------------------------------------------------------*/

	this.setupRoutes();
}

_.extend(Workbench.prototype, ServiceProviderMixin.prototype);
_.extend(Workbench.prototype, LoggerMixin.prototype);

Workbench.prototype.setupState = function(opts) {
	this._stateOpts = opts;

	_.forEach(this._stateOpts, function(value, key) {
		this._state.set(key, value);
		this.logger().info('[Workbench::setupState] added state property: ' + key + ' -> ' + value);
	}.bind(this));
}

Workbench.prototype.setupDatabase = function(opts) {
	this._dbOpts = opts;
}

Workbench.prototype.setupRoutes = function(router_config) {
	this._routerConfig = router_config;

	// Provide an admin interface as start page: 
	this._router.get('/', function(req, res) {
		console.log('wwwRoot: ' + this._state.get('wwwRoot') + '/index.html');
		res.sendfile(this._state.get('wwwRoot') + '/index.html');
	}.bind(this));

	this._router.get('/api/customsql', function(req, res) {
		if (!this._state.get('testClientLoadingAndErrorRoutes')) {
			this._state.get('db').customSql(req, res);
		} else {
			this.log.info('', '[SourceRecipies::findAll] Error state testing enabled');
			setTimeout(function() {
				// Send back an undefined payload for ember to bail out with an error:
				res.send(500, 'Something went wrong on the server!');
			}, 1500);
		}
	}.bind(this));

	// this._router.get('/api/parts', function(req, res) {
	// 	if (!this._state.get('testClientLoadingAndErrorRoutes')) {
	// 		this._dataProvider.source('data_backend').findAll(req, res);
	// 		// this._state.get('db').findAll(req, res);
	// 	} else {
	// 		this.log.info('', '[SourceRecipies::findAll] Error state testing enabled');
	// 		setTimeout(function() {
	// 			// Send back an undefined payload for ember to bail out with an error:
	// 			res.send(500, 'Something went wrong on the server!');
	// 		}, 1500);
	// 	}
	// }.bind(this));

	// this._router.get('/api/gericht', function(req, res) {
	// 	if (!this._state.get('testClientLoadingAndErrorRoutes')) {
	// 		this._state.get('db').findById(req, res);
	// 	} else {
	// 		this.log.info('', '[SourceRecipies::findAll] Error state testing enabled');
	// 		setTimeout(function() {
	// 			// Send back an undefined payload for ember to bail out with an error:
	// 			res.send();
	// 		}, 1500);
	// 	}
	// }.bind(this));

	// connection.query('INSERT INTO gericht SET ?', "Toast",
	//     function(err, result) {
	//         console.log('/gerichte get');
	//         if (err) throw err;
	//         res.send('User added to database with ID: ' + result.insertId);
	//     }
	// );
}