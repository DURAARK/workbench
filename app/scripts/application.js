define([
    'backbone',
    'communicator'
], function(Backbone, Communicator) {
    'use strict';

    var DuraArk = new Backbone.Marionette.Application();

    // Add application regions here
    DuraArk.addRegions({
        mainRegion: '#main-region'
    });

    // Initializer for 'Core' functionality
    DuraArk.addInitializer(function() {
        this.module('Core.Workbench').start();

        // Communicator.mediator.trigger("APP:START");
    });

    DuraArk.start();

    // TODO: maybe it can be beneficial to restrict the access to the Marionette.Application
    // object and provide only 'public' modules to the outside world?
    // return {
    //     // Core: Core, ?
    //     // SDO: SDO, ?
    //     Workbench: DuraArk.module('Core.Workbench')
    // };

    // ... currently the whole Marionette.Application object ist returned:
    return DuraArk;
});