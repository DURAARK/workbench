require([
    'backbone',
    'application',
    'regionManager',
    'modules/probado3d/main'
], function(Backbone, Workbench) {
    'use strict';

    Workbench.start();

    Workbench.module('Probado3D').start();
    // Workbench.module('Probado3D').stop();
});