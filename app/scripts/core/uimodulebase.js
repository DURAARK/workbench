define([
	'backbone.marionette',
	'workbenchui',
], function(Marionette, WorkbenchUI) {
	var UIModuleContrib = Marionette.Module.extend({
		startWithParent: false,

		constructor: function(moduleName, app, options) {
			console.log('[UIModuleBase] ctor called on: ' + moduleName);

			this.moduleName = moduleName;
			this.mainRegion = null;
		},

		initialize: function(options, moduleName, app) {
			console.log('[UIModuleBase] initialize called on: ' + moduleName);
			// WorkbenchUI.execute('module:register', 'Core.SessionManager');
		},

		onStart: function(options) {
			console.log('[UIModuleBase] onStart called on: ' + this.moduleName);
		},

		onStop: function(options) {
			console.log('[UIModuleBase] onStop called on: ' + this.moduleName);
		},

		setMainRegion: function(region) {
			console.log('[UIModuleBase] setMainRegion called on: ' + this.moduleName);

			this.mainRegion = region;
		}
	});

	return UIModuleContrib;

	// return {
	// 	Contrib: UIModuleContrib
	// };
});