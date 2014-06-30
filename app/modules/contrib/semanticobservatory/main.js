define([
    'backbone',
    'backbone.marionette',
    'workbenchui',
    'core/uimodulebase',
    './mainview.js'
], function(Backbone, Marionette, WorkbenchUI, UIModuleBase, SemanticObservatoryLayout) {
    
    WorkbenchUI.module('Contrib.SematicObservatory', UIModuleBase);

    var MyModule = WorkbenchUI.module("Contrib.SematicObservatory");

    WorkbenchUI.addInitializer(function() {
        // 1. Register module with the ModuleManager:
        WorkbenchUI.execute('module:register', 'Contrib.SematicObservatory');
        

        // 2. Register eventhandler to show the view:        
        WorkbenchUI.vent.on('module:semanticobservatory:show', function(region) {

            // First create the Model classes:
            var BuildmModel = Backbone.Model.extend({
                //urlRoot: "/services/buildm" //** TODO: this should be changed (copy-paste artifact)
                urlRoot: "https://dl.dropboxusercontent.com/u/985282/sdoinfo.json", // placeholder while this is down: "http://asev.l3s.uni-hannover.de:3000/sdoinfo",

                

                url: function() {
                    return this.urlRoot;
                }

            });

          
            if (!MyModule._mainView) {
                // Create emtpy main view and show it:
                MyModule._mainView = new SemanticObservatoryLayout();

                if (typeof region !== 'undefined') {
                    region.show(MyModule._mainView);
                } else {
                    this.mainRegion.show(MyModule._mainView);
                }
                console.log("Here01");
                console.log("BuildmModel=" + BuildmModel);
                // Use the WorkbenchUI.fetchModel() method here to grab the model with id 1. In the 'then' function 
                // callback it is guaranteed the the data from the server is received and the model is accessible:
                //WorkbenchUI.fetchModel(BuildmModel, 1).then(function(model) {
                WorkbenchUI.fetchModel(BuildmModel, 1).then(function(model) {
                    console.log("inside fetchmode..then()");
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

        console.log('[WorkbenchUI.Contrib.SematicObservatory] started');
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