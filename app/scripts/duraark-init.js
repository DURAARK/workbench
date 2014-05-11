// TODO: read modules from config file!

var modules_core = ['modules/module-manager/main'],
	modules_contrib = ['modules/probado3d/main'];

define([
	'backbone',
	'application',
	'regionManager'
].concat(modules_core).concat(modules_contrib), function(Backbone, DuraArk) {
	'use strict';

	DuraArk.Workbench.start();
	DuraArk.Workbench.execute('module:register', 'Contrib.Probado3D');

	return DuraArk;
});