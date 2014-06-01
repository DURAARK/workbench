var PluginDatabase = module.exports = function(router, opts, logger) {
	// this._setup(router, opts, logger);

	// var handler = this.create(opts);
	// var endpoint = opts.prefix + '/' + opts.id;

	// router.get(endpoint, handler);
}

PluginDatabase.prototype.findAll = function(req, res) {
	throw new Error('[PluginDatabase::findAll] Implement this method in derived object!');
};

PluginDatabase.prototype.findById = function(req, res) {
	throw new Error('[PluginDatabase::findById] Implement this method in derived object!');
};

PluginDatabase.prototype.add = function(req, res) {
	throw new Error('[PluginDatabase::add] Implement this method in derived object!');
};

PluginDatabase.prototype.update = function(req, res) {
	throw new Error('[PluginDatabase::update] Implement this method in derived object!');
};

PluginDatabase.prototype.delete = function(req, res) {
	throw new Error('[PluginDatabase::delete] Implement this method in derived object!');
};

PluginDatabase.prototype.create = function(opts) {
	throw new Error('[PluginDatabase::create] Implement this method in derived object!');
};

PluginDatabase.prototype.destroy = function() {
	throw new Error('[PluginDatabase::destroy] Implement this method in derived object!');
};

PluginDatabase.prototype._setup = function(router, opts) {
	// e.g.: options = {
	// 	id: 'parts',
	// 	interface: {
	// 		type: 'db',
	// 		backend: 'csv'
	// 	},
	// 	options: {
	// 		filename: 'mytable.csv'
	// 	}
	// }]);

	var handler = this.create(opts);
	var endpoint = opts.prefix + '/' + opts.id;

	router.get(endpoint, handler);
};