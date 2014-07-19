define([
	'backbone',
	'backbone.marionette',
	'workbenchui',
	'hbs!./templates/main',
], function(Backbone, Marionette, WorkbenchUI, MainViewTmpl) {
	var MainView = Marionette.ItemView.extend({
		template: MainViewTmpl,

		events: {
			'click .js-next': function() {
				WorkbenchUI.vent.trigger('module:fileidentification:show', this.sessionId);
			},

			"submit #myform": function() {
				$('input[name="mysubmit"]').attr("disabled", "disabled");
				$('#loading').show();

				window.stop();

				var UploadStatus = Backbone.Model.extend({
					urlRoot: '/uploadstatus'
				});
				var status = new UploadStatus({
					id: this.sessionId
				});

				console.log('query upload status:');
				setTimeout(function() {
					status.fetch().then(function(model) {
						// console.log('finished: ' + model.toJSON());
						$('#loading').hide();
						$('#myform').hide();
						$('#upload-finished').show();
					});
				}, 200);
			}
		},

		setSession: function(id) {
			console.log('[FileManager] set session: ' + id);
			this.sessionId = id;
		},

		onShow: function() {
			$('input[name="session"]').val(this.sessionId.toString());
			$('#loading').hide();
			$('#upload-finished').hide();
		},
	});

	return MainView;
});