define([
    'backbone',
    'backbone.marionette',
    'workbenchui',
    'core/uimodulebase',
    './mainview.js'
], function(Backbone, Marionette, WorkbenchUI, UIModuleBase, SearchAndRetriveLayout) {

    WorkbenchUI.module('Contrib.SemanticEnrichment', UIModuleBase);

    var MyModule = WorkbenchUI.module("Contrib.SemanticEnrichment");

    WorkbenchUI.addInitializer(function() {
        // 1. Register module with the ModuleManager:
        WorkbenchUI.execute('module:register', 'Contrib.SemanticEnrichment');

 // 2. Register eventhandler to show the view:
        WorkbenchUI.vent.on('module:semanticenrichment:show', function(aSearchterm) {
            // First create the Model classes:
            var SemObsModel = Backbone.Model.extend({                
                urlRoot: "/services/semanticenrichment" //no way to do this directly??
            });

          
            if (!MyModule._mainView) {
                // Create emtpy main view and show it:
                MyModule._mainView = new SearchAndRetriveLayout();

                if (typeof region !== 'undefined') {
                    region.show(MyModule._mainView);
                } else {
                    this.mainRegion.show(MyModule._mainView);
                }
                
                
                // Use the WorkbenchUI.fetchModel() method here to grab the model with id 1. In the 'then' function 
                // callback it is guaranteed the the data from the server is received and the model is accessible:
                //WorkbenchUI.fetchModel(BuildmModel, 1).then(function(model) {
                WorkbenchUI.fetchModel(SemObsModel,1).then(function(model) {
                    console.log("==> Now getting SemObsModel.");
                    if(typeof model==="undefined"){
                        alert('No meaningful result from endpoint. Maybe the endpoint is down?');
                    };                  
                    MyModule._mainView.updateBuildmData(model);
                });

            } else {
                console.log("==> This is the else zone!!");

                //*** TODO: / //FIXME: security..
                WorkbenchUI.fetchModel(SemObsModel,1).then(function(model) { 
                    if(typeof model==="undefined"){
                        alert('No meaningful result from endpoint. Maybe the endpoint is down?');
                    };    
                    MyModule._mainView.updateBuildmData(model);
                });

                // For the first show in the lifetime of the _mainView the events hash is correctly
                // evaluated. When the _mainView gets closed and is reopened again, the events
                // have to be delegated manually, otherwise e.g. the click events will not fire.
                // That's what the next line is for:
                MyModule._mainView.delegateEvents();
            }

        }.bind(this));

        console.log('[WorkbenchUI.Contrib.SemanticEnrichment] started');
    });

    // TODO: not working with this version of Marionette...
    // MyModule.addFinalizer(function() {
    //     WorkbenchUI.mainRegion.close();

    //     console.log('[WorkbenchUI.Contrib.SemanticEnrichment] stopped');
    // });

    // NOTE: No explicit return value is given here vor the AMD module. The module
    // is registered with the Marionette.Application and accessible via its
    // WorkbenchUI.module('...') syntax.
});








//================================================================

// define([
//     'backbone.marionette',
//     'workbenchui',
//     'core/uimodulebase',
//     './mainview.js'
// ], function(Marionette, WorkbenchUI, UIModuleBase, MainView) {

//     WorkbenchUI.module('Contrib.SemanticEnrichment', UIModuleBase);

//     var MyModule = WorkbenchUI.module("Contrib.SemanticEnrichment");

//     WorkbenchUI.addInitializer(function() {
//         // 1. Register module with the ModuleManager:
//         WorkbenchUI.execute('module:register', 'Contrib.SemanticEnrichment');

//         // 2. Register eventhandler to show the view:
//         WorkbenchUI.vent.on('module:semanticenrichment:show', function(region) {
//             console.log('module:semanticenrichment:show');

//             if (!MyModule._mainView) {
//                 MyModule._mainView = new MainView();
//             }

//             if (typeof region !== 'undefined') {
//                 region.show(MyModule._mainView);
//             } else {
//                 this.mainRegion.show(MyModule._mainView);
//             }

//             // For the first show in the lifetime of the _mainView the events hash is correctly
//             // evaluated. When the _mainView gets closed and is reopened again, the events
//             // have to be delegated manually, otherwise e.g. the click events will not fire.
//             // That's what the next line is for:
//             MyModule._mainView.delegateEvents();
            
//         }.bind(this));

//         console.log('[WorkbenchUI.Contrib.SemanticEnrichment] started');
//     });

//     // TODO: not working with this version of Marionette...
//     // MyModule.addFinalizer(function() {
//     //     WorkbenchUI.mainRegion.close();

//     //     console.log('[WorkbenchUI.Contrib.SemanticEnrichment] stopped');
//     // });

//     // NOTE: No explicit return value is given here vor the AMD module. The module
//     // is registered with the Marionette.Application and accessible via its
//     // WorkbenchUI.module('...') syntax.
// });