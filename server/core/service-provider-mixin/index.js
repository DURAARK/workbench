// 	interface: opts.interface,
// 	options: opts.options
// });

// Registers a 'csv' database located in 'mytable.csv' which gets
// served on the '/db/parts' route.
// this.registerEndpoints('/parts', {
// 	interface: {
// 		type: 'db',
// 		backend: 'csv'
// 	},
// 	options: {
// 		filename: 'mytable.csv'
// 	}
// });

// Registers a 'mysql' database located in 'mytable.csv' which gets
// served on the '/db/parts' route.
// this.registerEndpoints('/parts', {
// 	interface: {
// 		type: 'db',
// 		backend: 'mysql'
// 	},
// 	options: {
// 		host: 'localhost',
// 		user: 'root',
// 		password: ''
// 	}
// });

// Registers an 'api' module, providing a JSONAPI (or REST) interface
// on the route '/api/cache'. The API's logic is contained in '/plugins/dbcache/index.js'.
// Additional options are referencing the cache's source data type and location (or
// db credentials).
// Example method for REST interface: '/api/strstrcache/clear' or '/api/cache/rebuild'
// this.registerEndpoints('/cache', {
// 	interface: {
// 		type: 'api',
// 		plugin: 'dbcache'
// 	},
// 	options: {
// 		backend: 'csv',
// 		filename: 'mytable.csv'
// 	}
// });

var _ = require('underscore');

var ServiceProviderMixin = module.exports = function(router, opts, logger) {
	this.router = router;
	this.opts = opts;

	this.log = logger;
	if (!this.log) {
		this.log = require('npmlog');
	}

	this.plugins = {};
}

ServiceProviderMixin.prototype.registerEndpoints = function(endpoint_cfgs) {
	_.forEach(endpoint_cfgs, function(config, key) {
		this.log.info('Loading module "' + config.id + '" from /plugins/' + config.interface.type + '/' + config.interface.backend + '/index.js:');

		// FIXXME: configure ServiceProviderMixin with 'appRoot'!
		var MyPlugin = require('./plugins/' + config.interface.type + '/' + config.interface.backend + '/index.js');

		// console.log('bla: ' + JSON.stringify(config.options));
		// config = _.extend(config, {
		// 	id: config.id
		// });

		console.log('options: ' + JSON.stringify(config.options));

		var plugin = new MyPlugin(config.options, this.log);
		this.plugins[config.id] = plugin;

		var prefix = this._prefixFor(config.interface.type) || config.interface.type;
		if (plugin.findAll) {
			this.router.get(prefix + config.id, plugin.findAll.bind(plugin));
			this.log.info('   ... registered GET verb for: ' + prefix + config.id);
		}
		if (plugin.findById) {
			this.router.get(prefix + config.id + '/:id', plugin.findById.bind(plugin));
			this.log.info('   ... registered GET verb for: ' + prefix + config.id + '/:id');
		}
	}.bind(this));
}

ServiceProviderMixin.prototype.removeEndpoint = function(id) {
	if (this.plugins[id]) {
		this.plugins[id].destroy();
	} else {
		this.log.warning('No endpoint with this id registered. Continueing safely...');
	}
}

ServiceProviderMixin.prototype._prefixFor = function(type) {
	// FIXXME: read type/prefix mapping from config file!
	this._prefixes = {
		'db': '/db',
		'api': '/api',
	}

	return this._prefixes[type];
};

ServiceProviderMixin.prototype.plugins = function(id) {
	return this.plugins[id];
};