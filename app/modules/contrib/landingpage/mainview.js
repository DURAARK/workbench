define([
    'backbone.marionette',
    'hbs!./templates/main'
], function(Marionette, MainViewTmpl) {
    var MainView = Marionette.ItemView.extend({
        template: MainViewTmpl,

        events: {
            'click .js-next': function() {
                console.log('next clicked');
                WorkbenchUI.vent.trigger('module:sip:show');
            }
        }
    });

    return MainView;
});