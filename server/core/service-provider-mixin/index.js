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

var _ = require('underscore'),
    ExecutableService = require('./core/executable-service');

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
        this.log.info('Loading module "' + config.id + '" from ../../services/' + config.interface.handler);

        var ExecutableService = require('../../services/' + config.interface.handler);

        var executable_info = config.interface.command;

        // console.log('command: ' + JSON.stringify(executable_info));

        var service = new ExecutableService(executable_info, this.log);
        if (service.findById) {
            this.router.get(config.id + '/:id', service.findById.bind(service));
            this.log.info('   ... registered GET verb for: ' + config.id + '/:id');
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

ServiceProviderMixin.prototype.plugins = function(id) {
    return this.plugins[id];
};