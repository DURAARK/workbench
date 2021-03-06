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
    path = require('path');

var ServiceProviderMixin = module.exports = function(router, opts, logger) {
    this.router = router;
    this.opts = opts;

    this._session_manager = opts.sessionManager;
    this._appRoot = opts.appRoot;

    this.log = logger;
    if (!this.log) {
        this.log = require('npmlog');
    }

    this.plugins = {};
}

ServiceProviderMixin.prototype.registerEndpoints = function(endpoint_cfgs) {
    _.forEach(endpoint_cfgs, function(config, key) {
        var service_path = path.join(this._appRoot, 'services', config.interface.handler);

        console.log('[ServiceProviderMixin::registerEndpoints] loading module: ' + service_path);
        // this.log.info('Loading module "' + config.id + '" from ../../services/' + config.interface.handler);

        // Provide server root directory:
        config = _.extend(config, {
            appRoot: this._appRoot
        });

        var Service = require(service_path);
        var service = new Service(config, this._session_manager, this.log);

        if (service.findAll) {
            this.router.get(config.id, service.findAll.bind(service));
            this.log.info('   ... registered GET verb for: ' + config.id + '/');
        }
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
        this.log.warning('[ServiceProviderMixin::removeEndpoint] No endpoint with this id registered. Continue safely...');
    }
}

ServiceProviderMixin.prototype.plugins = function(id) {
    return this.plugins[id];
};