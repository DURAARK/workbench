define([
    'backbone.marionette',
    'workbenchui',
    './entities/session-model',
    'hbs!./templates/main'
], function(Marionette, WorkbenchUI, Session, MainViewTmpl) {
    var MainView = Marionette.ItemView.extend({
        template: MainViewTmpl,

        ui: {
            label: 'input[name=session-name]',
            demo_mode: 'input[name=demo-mode]'
        },

        events: {
            'click .js-next': function() {
                var opts = {
                        demo_mode: this.ui.demo_mode[0].checked
                    },
                    label = 'MyNewSession',
                    session = new Session();

                if (this.ui.label.val() !== '') {
                    label = this.ui.label.val();
                    session.set('label', label);
                }

                session.set('options', opts);
                session.save().then(function() {
                    console.log('[Welcome] Successfully created new session: "' + session.get('label') + '"');
                    console.log('Session configuration:');
                    console.log(session.toJSON());

                    WorkbenchUI.vent.trigger('module:sessionmanager:show');
                });
            }
        }
    });

    return MainView;
});