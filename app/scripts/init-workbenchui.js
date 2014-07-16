// TODO: read modules from config file!
var modules_core = [
        'modules/core/modulemanager/main',
        // 'modules/core/regionmanager/main'
    ],
    modules_contrib = [
        'modules/contrib/welcome/main',
        'modules/contrib/sessionmanager/main',
        'modules/contrib/fileidentification/main',
        'modules/contrib/metadataextractor/main',
        'modules/contrib/semanticobservatory/main',
        'modules/contrib/semanticenrichment/main',
        'modules/contrib/sipgenerator/main',
        'modules/contrib/searchandretrieve/main'
    ],
    services_contrib = [
        'services/contrib/metadata/ifc'
    ]

define([
    'workbenchui',
].concat(modules_core).concat(modules_contrib).concat(services_contrib), function(WorkbenchUI) {
    'use strict';

    // NOTE: This file is handling the (static) loading of modules for DuraArk
    // via RequireJS. No other logic is needed here.
    // The WorkbenchUI with all the loaded modules is returned and is used
    // in 'main.js' then

    return WorkbenchUI;
});