define([
    'backbone'
], function(Backbone) {
    var FileIdModel = Backbone.Model.extend({
        urlRoot: 'services/fileid',
        defaults: {
            format: 'undefined',
            label: 'undefined',
            identified: false,
            verified: false
        }
    });

    return FileIdModel;
});