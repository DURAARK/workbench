// TODO: read modules from config file!

var modules_core = ['modules/module-manager/main'],
	modules_contrib = ['modules/probado3d/main'];

require([
	'backbone',
	'application',
	'regionManager'
].concat(modules_core).concat(modules_contrib), function(Backbone, Workbench) {
	'use strict';

	Workbench.start();
	Workbench.execute('module:register', 'Contrib.Probado3D');
});