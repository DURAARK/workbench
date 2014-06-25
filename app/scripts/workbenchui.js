define([
    'backbone',
], function(Backbone) {
    'use strict';

    var WorkbenchUI = new Backbone.Marionette.Application();

    // Add application regions here
    WorkbenchUI.addRegions({
        mainRegion: '#main-region'
    });

    // Initializer for 'Core' functionality. In contrast to the 'contrib' modules the
    // 'core' modules are started explicitly:
    WorkbenchUI.addInitializer(function() {
        this.module('Core.ModuleManager').start();
        this.module('Core.SessionManager').start();

        // Define default namespaces:
        WorkbenchUI.module('Core');
        WorkbenchUI.module('Contrib');
    });

    // A convenience method to request a model with the given id. Returns a jQuery promise.
    WorkbenchUI.fetchModel = function(model_constructor, id) {
        // Create a new model instance with the given id. When you call mymodel.fetch() a request
        // to the url '/metadata/ifc/id' will be send to the server:
        console.log('WorkbenchUI.fetchModel');
        var mymodel = new model_constructor({
            id: id
        });

        // This is a bit of magic that handles the asynchroneous request.
        var defer = $.Deferred();
        mymodel.fetch({
            success: function(data) {
                defer.resolve(data);
            },
            error: function(data) {
                defer.resolve(undefined);
            }
        });
        return defer.promise();
    }
    WorkbenchUI.start();

    return WorkbenchUI;
});