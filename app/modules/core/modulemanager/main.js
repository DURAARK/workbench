/**
 * 'ModuleManager' is a core module that allows to register modules. The registered modules are
 * accessible via an administration page, where they can be enabled, disabled or configured in
 * general.
 *
 * - adds the 'module' command namespace, e.g. Workbench.execute('module:register')
 */
define([
    'backbone',
    'workbenchui',
    'core/uimodulebase',
    'hbs!./templates/main'
], function(Marionette, WorkbenchUI, UIModuleBase, LandingPage_tmpl) {

    WorkbenchUI.module('Core.ModuleManager', UIModuleBase);

    var MyModule = WorkbenchUI.module("Core.ModuleManager");

    var MainView = Backbone.Marionette.ItemView.extend({
        template: LandingPage_tmpl
    });

    MyModule.addInitializer(function() {

        console.log('[WorkbenchUI.Core.ModuleManager] started');

        WorkbenchUI.commands.setHandler("module:register", function(module_name) {
            // TODO: add the registered module as <li> to the administration page of the
            // module manager.

            // TODO: create a new <div> here an set this <div> as root element of the
            // registered module. The content of this <div> will be shown if the module
            // gets selected for viewing.
            WorkbenchUI.module(module_name).setMainRegion(WorkbenchUI.mainRegion);

            console.log('[WorkbenchUI.Core.ModuleManager] registered module "' + module_name + '"');
        });

        MyModule.mainView = new MainView();
        WorkbenchUI.mainRegion.show(MyModule.mainView);
    });

    MyModule.addFinalizer(function() {
        WorkbenchUI.mainRegion.close();

        console.log('[WorkbenchUI.Core.ModuleManager] stopped');
    });

    // NOTE: No explicit return value is given here vor the AMD module. The module
    // is registered with the Marionette.Application and accessible via its
    // WorkbenchUI.module('...') syntax.
    // return MyModule;

});