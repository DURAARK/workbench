define([
	'backbone.marionette',
	'workbenchui',
	'hbs!./templates/main',
], function(Marionette, WorkbenchUI, MainViewTmpl) {
	var MainView = Marionette.ItemView.extend({
		template: MainViewTmpl,

		events: {
			'click .js-next': function() {
				WorkbenchUI.vent.trigger('module:fileidentification:show', this.sessionId);
			}
		},

		setSession: function(id) {
			console.log('[FileManager] set session: ' + id);
			this.sessionId = id;
		},

		onShow: function() {
			$('input[name="session"]').val(this.sessionId.toString());
		},
	});

	return MainView;
});