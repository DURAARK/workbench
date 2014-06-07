define([
    'backbone',
    'backbone.marionette',
    'workbenchui',
    'core/uimodulebase',
    './mainview.js'
], function(Backbone, Marionette, WorkbenchUI, UIModuleBase, MetadataLayout) {

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
                urlRoot: "/services/buildm"
            });

            if (!MyModule._mainView) {
                // Use the WorkbenchUI.fetchModel() method here to grab the model with id 1. In the 'then' function 
                // callback it is guaranteed the the data from the server is received and the model is accessible:
                WorkbenchUI.fetchModel(IfcmModel, 1).then(function(model) {
                    MyModule._mainView = new MetadataLayout({
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