/**
 * 'ModuleManager' is a core module that allows to register modules. The registered modules are
 * accessible via an administration page, where they can be enabled, disabled or configured in
 * general.
 *
 * - adds the 'module' command namespace, e.g. Workbench.execute('module:register')
 */
define([
    'backbone',
    'application',
    'hbs!modules/module-manager/templates/main'
], function(Marionette, Workbench, LandingPage_tmpl) {

    Workbench.module('Core.ModuleManager', {
        startWithParent: false
    });

    var MyModule = Workbench.module("Core.ModuleManager");

    var MainView = Backbone.Marionette.ItemView.extend({
        template: LandingPage_tmpl
    });

    MyModule.addInitializer(function() {
        Workbench.commands.setHandler("module:register", function(module_name) {
            // TODO: add the registered module as <li> to the administration page of the
            // module manager.

            // TODO: create a new <div> here an set this <div> as root element of the
            // registered module. The content of this <div> will be shown if the module
            // gets selected for viewing.
            Workbench.module(module_name).start({
                // rootEl: '#module-root-div'
            });

            console.log('[Workbench.Core.ModuleManager] registered module "' + module_name + '"');
        });

        MyModule.mainView = new MainView();
        Workbench.mainRegion.show(MyModule.mainView);

        console.log('[Workbench.Core.ModuleManager] started');
    });

    MyModule.addFinalizer(function() {
        Workbench.mainRegion.close();

        console.log('[Workbench.Core.ModuleManager] stopped');
    });

    // NOTE: No explicit return value is given here vor the AMD module. The module
    // is registered with the Marionette.Application and accessible via its
    // Workbench.module('...') syntax.
    // return MyModule;

});