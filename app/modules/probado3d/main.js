define([
    'backbone',
    'application',
    'hbs!modules/probado3d/templates/main'
], function(Marionette, Workbench, Probado3D_tmpl) {

    Workbench.module('Probado3D', {
        startWithParent: false
    });

    var MyModule = Workbench.module("Probado3D");

    var SomeView = Backbone.Marionette.ItemView.extend({
        template: Probado3D_tmpl
    });

    MyModule.addInitializer(function() {
        MyModule.someView = new SomeView();
        Workbench.mainRegion.show(MyModule.someView);

        console.log('[Module.Probado3D] started');
    });

    MyModule.addFinalizer(function() {
        Workbench.mainRegion.close();

        console.log('[Module.Probado3D] stopped');
    });

    // NOTE: No explicit return value is given here vor the AMD module. The module
    // is registered with the Marionette.Application and accessible via its
    // Workbench.module('...') syntax.
    // return MyModule;

});