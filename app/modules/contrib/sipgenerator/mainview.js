define([
	'backbone.marionette',
	'workbenchui',
	'hbs!./templates/main'
], function(Marionette, WorkbenchUI, MainViewTmpl) {
	var MainView = Marionette.ItemView.extend({
		template: MainViewTmpl,

		events: {
			'click .js-upload': function() {
				console.log('upload clicked');
				alert('Rosetta-SIP generated and uploaded to Rosetta!');
				WorkbenchUI.vent.trigger('module:searchandretrieve:show');
			},
			'click .js-previous': function() {
				console.log('previous');
				WorkbenchUI.vent.trigger('module:semanticenrichment:show');
			}
		}
	});

	return MainView;
});