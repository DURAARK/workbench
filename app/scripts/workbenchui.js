define([
    'backbone',
], function(Backbone) {
    'use strict';

    var WorkbenchUI = new Backbone.Marionette.Application();

    // Add application regions here
    WorkbenchUI.addRegions({
        mainRegion: '#main-region'
    });

    // Initializer for 'Core' functionality. In contrast to the 'contrib' modules the
    // 'core' modules are started explicitly:
    WorkbenchUI.addInitializer(function() {
        this.module('Core.ModuleManager').start();
        this.module('Core.SessionManager').start();

        // Define default namespaces:
        WorkbenchUI.module('Core');
        WorkbenchUI.module('Contrib');
    });

    WorkbenchUI.start();

    return WorkbenchUI;
});