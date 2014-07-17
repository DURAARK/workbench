require([
    'init-workbenchui'
], function(WorkbenchUI) {
    'use strict';

    // The 'DuraArk' application is available here. Module loading, configuration and
    // starting the application is already done. Have fun!

    WorkbenchUI.vent.trigger('module:landingpage:show');

    console.log('[WorkbenchUI] Successfully started, have fun!');
});