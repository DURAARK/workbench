define([
    'backbone',
    'duraark-init',
    'hbs!modules/probado3d/templates/main'
], function(Marionette, DuraArk, LandingPage_tmpl) {

    DuraArk.Workbench.module('Contrib.Probado3D', {
        startWithParent: false
    });

    var MyModule = DuraArk.Workbench.module("Contrib.Probado3D");

    var MainView = Backbone.Marionette.ItemView.extend({
        template: LandingPage_tmpl
    });

    MyModule.addInitializer(function() {
        MyModule.mainView = new MainView();
        DuraArk.Workbench.mainRegion.show(MyModule.mainView);

        console.log('[Workbench.Contrib.Probado3D] started');
    });

    MyModule.addFinalizer(function() {
        DuraArk.Workbench.mainRegion.close();

        console.log('[Workbench.Contrib.Probado3D] stopped');
    });

    // NOTE: No explicit return value is given here vor the AMD module. The module
    // is registered with the Marionette.Application and accessible via its
    // Workbench.module('...') syntax.
    // return MyModule;

});