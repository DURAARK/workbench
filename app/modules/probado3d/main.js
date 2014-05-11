define([
    'backbone',
    'application',
    'hbs!modules/probado3d/templates/main'
], function(Marionette, Workbench, LandingPage_tmpl) {

    Workbench.module('Contrib.Probado3D', {
        startWithParent: false
    });

    var MyModule = Workbench.module("Contrib.Probado3D");

    var MainView = Backbone.Marionette.ItemView.extend({
        template: LandingPage_tmpl
    });

    MyModule.addInitializer(function() {
        MyModule.mainView = new MainView();
        Workbench.mainRegion.show(MyModule.mainView);

        console.log('[Workbench.Contrib.Probado3D] started');
    });

    MyModule.addFinalizer(function() {
        Workbench.mainRegion.close();

        console.log('[Workbench.Contrib.Probado3D] stopped');
    });

    // NOTE: No explicit return value is given here vor the AMD module. The module
    // is registered with the Marionette.Application and accessible via its
    // Workbench.module('...') syntax.
    // return MyModule;

});