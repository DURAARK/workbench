define(['backbone'], function() {
    var SessionModel = Backbone.Model.extend({
        urlRoot: "/services/session",
        defaults: {
            label: 'MyNewSession',
            options: {
                demo_mode: false
            }
        }
    });

    return SessionModel;
})