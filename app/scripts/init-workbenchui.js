// TODO: read modules from config file!
var modules_core = [
		'modules/core/modulemanager/main',
		// 'modules/core/regionmanager/main'
	],
	modules_contrib = [
		'modules/contrib/sessionmanager/main',
		'modules/contrib/fileidentification/main',
		'modules/contrib/metadataextractor/main',
		'modules/contrib/semanticenrichment/main',
		'modules/contrib/sipgenerator/main',
		'modules/contrib/searchandretrieve/main'
	];

define([
	'workbenchui',
].concat(modules_core).concat(modules_contrib), function(WorkbenchUI) {
	'use strict';

	// NOTE: This file is handling the (static) loading of modules for DuraArk
	// via RequireJS. No other logic is needed here.
	// The WorkbenchUI with all the loaded modules is returned and is used
	// in 'main.js' then

	return WorkbenchUI;
});