define([
	'backbone',
	'./fileid-model'
], function(Backbone, FileIdModel) {
	var FileIdCollection = Backbone.Collection.extend({
		url: function() {
			return '/services/fileid/' + this.meta('sessionId');
		},

		model: FileIdModel,

		initialize: function() {
			this._meta = {};
		},

		meta: function(prop, value) {
			if (value === undefined) {
				return this._meta[prop]
			} else {
				this._meta[prop] = value;
			}
		},

	});

	return FileIdCollection;
})