define([
    'backbone',
    'communicator'
], function(Backbone, Communicator) {
    'use strict';

    var Workbench = new Backbone.Marionette.Application();

    /* Add application regions here */
    Workbench.addRegions({
        mainRegion: '#main-region'
    });

    /* Add initializers here */
    Workbench.addInitializer(function() {
        Workbench.module('Core.ModuleManager').start();

        Communicator.mediator.trigger("APP:START");

        console.log('[Workbench.Application] started');
    });

    return Workbench;
});