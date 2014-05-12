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
    'hbs!modules/workbench/templates/main'
], function(Marionette, DuraArk, LandingPage_tmpl) {

    DuraArk.module('Core.Workbench', {
        startWithParent: false
    });

    var MyModule = DuraArk.module("Core.Workbench");

    var MainView = Backbone.Marionette.ItemView.extend({
        template: LandingPage_tmpl
    });

    MyModule.addInitializer(function() {
        DuraArk.commands.setHandler("module:register", function(module_name) {
            // TODO: add the registered module as <li> to the administration page of the
            // module manager.

            // TODO: create a new <div> here an set this <div> as root element of the
            // registered module. The content of this <div> will be shown if the module
            // gets selected for viewing.
            DuraArk.module(module_name).start({
                // rootEl: '#module-root-div'
            });

            console.log('[DuraArk.Core.Workbench] registered module "' + module_name + '"');
        });

        MyModule.mainView = new MainView();
        DuraArk.mainRegion.show(MyModule.mainView);

        console.log('[DuraArk.Core.Workbench] started');
    });

    MyModule.addFinalizer(function() {
        DuraArk.mainRegion.close();

        console.log('[DuraArk.Core.Workbench] stopped');
    });

    // NOTE: No explicit return value is given here vor the AMD module. The module
    // is registered with the Marionette.Application and accessible via its
    // Workbench.module('...') syntax.
    // return MyModule;

});