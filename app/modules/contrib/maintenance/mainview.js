define([
    'backbone.marionette',
    'workbenchui',
    'hbs!./templates/main'
], function(Marionette, WorkbenchUI, MainViewTmpl) {
    var MainView = Marionette.ItemView.extend({
        template: MainViewTmpl,

        events: {
            'click .js-sdo-content': function() {
                WorkbenchUI.vent.trigger('module:semanticobservatory:show');
            },
            'click .js-crawler': function() {
                window.open('modules/contrib/sdo/', '_self');
            }
        },
    });

    return MainView;
});