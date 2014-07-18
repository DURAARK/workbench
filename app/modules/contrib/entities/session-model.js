define([
    'backbone'
], function(Backbone) {
    var SessionModel = Backbone.Model.extend({
        urlRoot: 'services/session',
        defaults: {
            label: 'MyNewSession',
            options: {
                demo_mode: false
            },
            files: []
        }
    });

    return SessionModel;
})