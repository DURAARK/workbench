define([
    'backbone',
    'application',
    'hbs!./templates/main'
], function(Marionette, DuraArk, LandingPage_tmpl) {

    DuraArk.module('Contrib.Probado3D', {
        startWithParent: false
    });

    var MyModule = DuraArk.module("Workbench.Probado3D");

    var MainView = Backbone.Marionette.ItemView.extend({
        template: LandingPage_tmpl
    });

    MyModule.addInitializer(function() {
        DuraArk.execute('workbench:module:register', 'Contrib.Probado3D');

        MyModule.mainView = new MainView();
        DuraArk.mainRegion.show(MyModule.mainView);

        console.log('[DuraArk.Workbench.Probado3D] started');
    });

    MyModule.addFinalizer(function() {
        DuraArk.mainRegion.close();

        console.log('[DuraArk.Workbench.Probado3D] stopped');
    });

    // NOTE: No explicit return value is given here vor the AMD module. The module
    // is registered with the Marionette.Application and accessible via its
    // Workbench.module('...') syntax.
    // return MyModule;

});