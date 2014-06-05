define([
    'backbone.marionette',
    'workbenchui',
    'core/uimodulebase',
    './mainview.js'
], function(Marionette, WorkbenchUI, UIModuleBase, MainView) {

    WorkbenchUI.module('Contrib.MetadataExtractor', UIModuleBase);

    var MyModule = WorkbenchUI.module("Contrib.MetadataExtractor");

    WorkbenchUI.addInitializer(function() {
        // 1. Register module with the ModuleManager:
        WorkbenchUI.execute('module:register', 'Contrib.MetadataExtractor');

        // 2. Register eventhandler to show the view:
        WorkbenchUI.vent.on('module:metadataextractor:show', function() {
            console.log('module:metadataextractor:show');

            // First create the Model class that refers to a REST url, in this case '/metadata/ifc'
            var IfcmModel = Backbone.Model.extend({
                urlRoot: "/metadata/ifc"
            });

            // this method sends a request to the url specified in the Model class above and returns the
            // received data via a valid model:
            function fetchModel(id) {
                // Create a new model instance with the given id. When you call mymodel.fetch() a request
                // to the url '/metadata/ifc/id' will be send to the server:
                var mymodel = new IfcmModel({
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

            if (!MyModule._mainView) {
                // Use the fetchModel() method here to grab the model with id 1. In the 'then' function 
                // callback it is guaranteed the the data from the server is received and the model is accessible:
                fetchModel(1).then(function(model) {
                    MyModule._mainView = new MainView({
                        model: model
                    });

                    if (typeof region !== 'undefined') {
                        region.show(MyModule._mainView);
                    } else {
                        this.mainRegion.show(MyModule._mainView);
                    }
                }.bind(this));
            } else {
                if (typeof region !== 'undefined') {
                    region.show(MyModule._mainView);
                } else {
                    this.mainRegion.show(MyModule._mainView);
                }

                // For the first show in the lifetime of the _mainView the events hash is correctly
                // evaluated. When the _mainView gets closed and is reopened again, the events
                // have to be delegated manually, otherwise e.g. the click events will not fire.
                // That's what the next line is for:
                MyModule._mainView.delegateEvents();
            }

        }.bind(this));

        console.log('[WorkbenchUI.Contrib.MetadataExtractor] started');
    });

    // TODO: not working with this version of Marionette...
    // MyModule.addFinalizer(function() {
    //     WorkbenchUI.mainRegion.close();

    //     console.log('[WorkbenchUI.Contrib.MetadataExtractor] stopped');
    // });

    // NOTE: No explicit return value is given here vor the AMD module. The module
    // is registered with the Marionette.Application and accessible via its
    // WorkbenchUI.module('...') syntax.
});