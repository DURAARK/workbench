define([
    'backbone',
    'backbone.marionette',
    'workbenchui',
    'core/uimodulebase',
    './mainview.js'
], function(Backbone, Marionette, WorkbenchUI, UIModuleBase, SearchAndRetriveLayout) {

    WorkbenchUI.module('Contrib.SearchAndRetrieve', UIModuleBase);

    var MyModule = WorkbenchUI.module("Contrib.SearchAndRetrieve");

    WorkbenchUI.addInitializer(function() {
        // 1. Register module with the ModuleManager:
        WorkbenchUI.execute('module:register', 'Contrib.SearchAndRetrieve');

 // 2. Register eventhandler to show the view:
        WorkbenchUI.vent.on('module:searchandretrieve:show', function(region) {
            console.log('module:searchandretrieve:show');

            // First create the Model classes:
            var SemObsModel = Backbone.Model.extend({                
                urlRoot: "/services/probado" //no way to do this directly??
                //urlRoot: "http://asev.l3s.uni-hannover.de:3000/sdoinfo", //error!      

                // url: function() {
                //     return this.urlRoot;
                // }

            });

          
            if (!MyModule._mainView) {
                // Create emtpy main view and show it:
                MyModule._mainView = new SearchAndRetriveLayout();

                if (typeof region !== 'undefined') {
                    region.show(MyModule._mainView);
                } else {
                    this.mainRegion.show(MyModule._mainView);
                }
                
                console.log("SearchAndRetriveModel=" + SemObsModel);
                // Use the WorkbenchUI.fetchModel() method here to grab the model with id 1. In the 'then' function 
                // callback it is guaranteed the the data from the server is received and the model is accessible:
                //WorkbenchUI.fetchModel(BuildmModel, 1).then(function(model) {
                WorkbenchUI.fetchModel(SemObsModel,"start=0&count=10").then(function(model) { //search uses: fulltextQuery=Kamille&start=0&count=10
                //WorkbenchUI.fetchModel(SemObsModel,"fulltextQuery=Kamille&start=0&count=10").then(function(model) { //FIXME: security..
                    console.log("inside fetchmode..then()");
                    MyModule._mainView.updateBuildmData(model);
                });

            } else {
                console.log("==> This is the else zone!!");
                // if (typeof region !== 'undefined') {
                //     region.show(MyModule._mainView);
                // } else {
                //     this.mainRegion.show(MyModule._mainView);
                // }

                //***
                WorkbenchUI.fetchModel(SemObsModel,"fulltextQuery=Kamille&start=0&count=10").then(function(model) { //search uses: fulltextQuery=Kamille&start=0&count=10
                //WorkbenchUI.fetchModel(SemObsModel,"fulltextQuery=Kamille&start=0&count=10").then(function(model) { //FIXME: security..
                    console.log("inside fetchmode..then()");
                    MyModule._mainView.updateBuildmData(model);
                });

                // For the first show in the lifetime of the _mainView the events hash is correctly
                // evaluated. When the _mainView gets closed and is reopened again, the events
                // have to be delegated manually, otherwise e.g. the click events will not fire.
                // That's what the next line is for:
                MyModule._mainView.delegateEvents();
            }

        }.bind(this));

        console.log('[WorkbenchUI.Contrib.SearchAndRetrieve] started');
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

