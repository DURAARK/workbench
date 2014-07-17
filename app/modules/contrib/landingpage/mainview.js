define([
    'backbone.marionette',
    'workbenchui',
    'hbs!./templates/main'
], function(Marionette, WorkbenchUI, MainViewTmpl) {
    var MainView = Marionette.ItemView.extend({
        template: MainViewTmpl,

        events: {
            'click .js-geometric-enrichment': function() {
                WorkbenchUI.vent.trigger('module:geometricenrichment:show');
            },
            'click .js-sip-generation': function() {
                WorkbenchUI.vent.trigger('module:sip:show');
            },
            'click .js-maintenance': function() {
                WorkbenchUI.vent.trigger('module:maintenance:show');
            },
            'click .js-search-retrieval': function() {
                WorkbenchUI.vent.trigger('module:searchandretrieve:show');
            },
        }
    });

    return MainView;
});