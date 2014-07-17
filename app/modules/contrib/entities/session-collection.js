define([
    'backbone',
    './session-model'
], function(Backbone, SessionModel) {
    var SessionCollection = Backbone.Collection.extend({
        url: "/services/session",
        model: SessionModel
    });

    return SessionCollection;
})