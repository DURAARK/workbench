

define([
    'backbone',
    'backbone.marionette',
    'workbenchui',
    'core/uimodulebase',
    './mainview.js'
], function(Backbone, Marionette, WorkbenchUI, UIModuleBase, MainView) {

    WorkbenchUI.module('Contrib.SIPGenerator', UIModuleBase);

    var MyModule = WorkbenchUI.module("Contrib.SIPGenerator");

    WorkbenchUI.addInitializer(function() {
        // 1. Register module with the ModuleManager:
        WorkbenchUI.execute('module:register', 'Contrib.SIPGenerator');

 // 2. Register eventhandler to show the view:
        WorkbenchUI.vent.on('module:sipgenerator:show', function(aSearchterm) {
            console.log('module:sipgenerator:show');
            
            //Static model that will be used until we connect with the real files that will be put in the SIP



            // First create the Model classes:
            var SemObsModel = Backbone.Model.extend({                               
                //Placeholder data that will be used until we connect with the real files that will be put in the SIP                
                //urlRoot: "/services/probado",
                urlRoot: "https://dl.dropboxusercontent.com/u/985282/sipfile_fake.json", //Fake placeholder data                
            });

          
            if (!MyModule._mainView) {
                // Create emtpy main view and show it:
                MyModule._mainView = new MainView();

                if (typeof region !== 'undefined') {
                    region.show(MyModule._mainView);
                } else {
                    this.mainRegion.show(MyModule._mainView);
                }
                
                
                // Use the WorkbenchUI.fetchModel() method here to grab the model with id 1. In the 'then' function 
                // callback it is guaranteed the the data from the server is received and the model is accessible:
                //WorkbenchUI.fetchModel(BuildmModel, 1).then(function(model) {
                WorkbenchUI.fetchModel(SemObsModel,"").then(function(model) {
                    console.log("==> Not-the-Else-part and model = " + JSON.stringify(model)); //**HERE!**
                    if(typeof model=="undefined"){
                        alert('No meaningful result from endpoint. Maybe the endpoint is down?');
                    };                  
                    MyModule._mainView.updateBuildmData(model);
                });

            } else {
                console.log("==> This is the else zone!!");

                //*** TODO: / //FIXME: security..
                WorkbenchUI.fetchModel(SemObsModel,1).then(function(model) { //search uses: fulltextQuery=Kamille&start=0&count=10
                    // if(typeof model=="undefined"){
                    //     alert('No meaningful result from endpoint. Maybe the endpoint is down?');
                    // };    
                    console.log("==> Else part and model = " + JSON.stringify(model)); //**

                    MyModule._mainView.updateBuildmData(model);
                });

                // For the first show in the lifetime of the _mainView the events hash is correctly
                // evaluated. When the _mainView gets closed and is reopened again, the events
                // have to be delegated manually, otherwise e.g. the click events will not fire.
                // That's what the next line is for:
                MyModule._mainView.delegateEvents();
            }

        }.bind(this));

        console.log('[WorkbenchUI.Contrib.SIPGenerator] started');
    });

    // TODO: not working with this version of Marionette...
    // MyModule.addFinalizer(function() {
    //     WorkbenchUI.mainRegion.close();

    //     console.log('[WorkbenchUI.Contrib.SearchAndRetrieve] stopped');
    // });

    // NOTE: No explicit return value is given here vor the AMD module. The module
    // is registered with the Marionette.Application and accessible via its
    // WorkbenchUI.module('...') syntax.
});

