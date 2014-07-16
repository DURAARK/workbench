define([
    'backbone.marionette',
    'workbenchui',
    './entities/session-model',
    'hbs!./templates/sessions-main',
    'hbs!./templates/session-item'
], function(
    Marionette,
    WorkbenchUI,
    Session,
    SessionsViewTmpl,
    SessionItemTmpl
) {

    var SessionItemView = Marionette.ItemView.extend({
        template: SessionItemTmpl
    });

    // Represents the table view, which is using the ListItemView to render its items:
    var SessionsView = Backbone.Marionette.CompositeView.extend({

        template: SessionsViewTmpl,

        itemView: SessionItemView,

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

                    if (session.get('options').demo_mode) {
                        WorkbenchUI.vent.trigger('module:fileidentification:show');
                        // WorkbenchUI.vent.trigger('module:sipgenerator:show');
                    } else {
                        WorkbenchUI.vent.trigger('module:sessionmanager:show');
                    }
                });
            }
        },

        ui: {
            label: 'input[name=session-name]',
            demo_mode: 'input[name=demo-mode]'
        },

        appendHtml: function(collectionView, itemView) {
            collectionView.$('tbody').append(itemView.el);
        }
    });

    return SessionsView;
});