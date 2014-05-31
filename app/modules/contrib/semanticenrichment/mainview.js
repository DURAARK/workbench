define([
	'backbone.marionette',
	'workbenchui',
	'hbs!./templates/main'
], function(Marionette, WorkbenchUI, MainViewTmpl) {
	var MainView = Marionette.ItemView.extend({
		template: MainViewTmpl,

		events: {
			'click .js-next': function() {
				console.log('next clicked');
				WorkbenchUI.vent.trigger('module:sipgenerator:show');
			},
			'click .js-previous': function() {
				console.log('previous');
				WorkbenchUI.vent.trigger('module:metadataextractor:show');
			}
		}
	});

	return MainView;
});