define([
    'backbone.marionette',
    'workbenchui',
    'core/uimodulebase',
    '../entities/fileid-collection',
    './mainview.js'
], function(Marionette, WorkbenchUI, UIModuleBase, FileIds, FileIdLayout) {

    WorkbenchUI.module('Contrib.FileIdentification', UIModuleBase);

    var MyModule = WorkbenchUI.module("Contrib.FileIdentification");

    WorkbenchUI.addInitializer(function() {
        // 1. Register module with the ModuleManager:
        WorkbenchUI.execute('module:register', 'Contrib.FileIdentification');

        // 2. Register eventhandler to show the view:
        WorkbenchUI.vent.on('module:fileidentification:show', function(id, region) {
            if (!MyModule._mainView) {

                MyModule._fileIds = new FileIds();
                MyModule._fileIds.meta('sessionId', id);

                console.log('sessoinId: ' + MyModule._fileIds.get('sessionId'));

                MyModule._mainView = new FileIdLayout();

                if (typeof region !== 'undefined') {
                    region.show(MyModule._mainView);
                } else {
                    this.mainRegion.show(MyModule._mainView);
                }

                function onDataHandler(model) {
                    console.log('model da: ' + model);
                };

                function onErrorHandler(model, xhr, options) {
                    if (xhr.status === 404) {
                        MyModule._mainView.showEmptyView();
                    }
                };

                MyModule._fileIds.fetch({
                    success: onDataHandler,
                    error: onErrorHandler
                });

            } else {
                if (typeof region !== 'undefined') {
                    region.show(MyModule._mainView);
                } else {
                    this.mainRegion.show(MyModule._mainView);
                }

                // For the first show in the lifetime of the _mainView the events hash is correctly
                // evaluated. When the _mainView gets closed and is reopened again, the events
                // have to be delegated manually, otherwise e.g. the click events will not fire.
                // That's what the next line is for:
                MyModule._mainView.delegateEvents();
            }


        }.bind(this));

        console.log('[WorkbenchUI.Contrib.FileIdentification] started');
    });

    // TODO: not working with this version of Marionette...
    // MyModule.addFinalizer(function() {
    //     WorkbenchUI.mainRegion.close();

    //     console.log('[WorkbenchUI.Contrib.FileIdentification] stopped');
    // });

    // NOTE: No explicit return value is given here vor the AMD module. The module
    // is registered with the Marionette.Application and accessible via its
    // WorkbenchUI.module('...') syntax.
});