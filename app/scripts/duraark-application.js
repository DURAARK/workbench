// TODO: read modules from config file!

var modules_core = ['modules/core/workbench/main'],
    modules_contrib = ['modules/contrib/probado3d/main'];

define([
    'require',
    'backbone',
    'application',
    'regionManager'
].concat(modules_core).concat(modules_contrib), function(Backbone, DuraArk) {
    'use strict';

    // NOTE: This file is handling the (static) loading of modules for DuraArk
    // via RequireJS. No other logic is needed here...

    return DuraArk;
});