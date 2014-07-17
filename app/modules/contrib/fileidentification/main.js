define([
    'backbone.marionette',
    'workbenchui',
    'core/uimodulebase',
    './mainview.js'
], function(Marionette, WorkbenchUI, UIModuleBase, FileIdLayout) {

    WorkbenchUI.module('Contrib.FileIdentification', UIModuleBase);

    var MyModule = WorkbenchUI.module("Contrib.FileIdentification");

    WorkbenchUI.addInitializer(function() {
        // 1. Register module with the ModuleManager:
        WorkbenchUI.execute('module:register', 'Contrib.FileIdentification');

        // 2. Register eventhandler to show the view:
        WorkbenchUI.vent.on('module:fileidentification:show', function(id, region) {
            console.log('module:fileidentification:show');

            var FileIdModel = Backbone.Model.extend({
                urlRoot: "/services/fileid"
            });

            if (!MyModule._mainView) {
                // Create emtpy main view and show it:
                MyModule._mainView = new FileIdLayout();

                if (typeof region !== 'undefined') {
                    region.show(MyModule._mainView);
                } else {
                    this.mainRegion.show(MyModule._mainView);
                }

                // Use the WorkbenchUI.fetchModel() method here to grab the model with id 1. In the 'then' function 
                // callback it is guaranteed the the data from the server is received and the model is accessible:
                // FIXXME: the session id is hardcoded for the moment!
                WorkbenchUI.fetchModel(FileIdModel, 0).then(function(model) {
                    MyModule._mainView.updateBuildmData(model);
                });

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

        console.log('[WorkbenchUI.Contrib.FileIdentification] started');
    });

    // TODO: not working with this version of Marionette...
    // MyModule.addFinalizer(function() {
    //     WorkbenchUI.mainRegion.close();

    //     console.log('[WorkbenchUI.Contrib.FileIdentification] stopped');
    // });

    // NOTE: No explicit return value is given here vor the AMD module. The module
    // is registered with the Marionette.Application and accessible via its
    // WorkbenchUI.module('...') syntax.
});