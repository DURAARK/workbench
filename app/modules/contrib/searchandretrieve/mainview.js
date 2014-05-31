define([
	'backbone.marionette',
	'workbenchui',
	'hbs!./templates/main'
], function(Marionette, WorkbenchUI, MainViewTmpl) {
	var MainView = Marionette.ItemView.extend({
		template: MainViewTmpl,

		events: {
			'click .js-search': function() {
				console.log('search clicked');
				alert('The search result is: blablub');
			}
		}
	});

	return MainView;
});