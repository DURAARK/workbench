define([
    'backbone.marionette',
    'workbenchui',
    './entities/session-model',
    'hbs!./templates/sessions-main',
    'hbs!./templates/session-item',
    'hbs!./templates/session-empty',
], function(
    Marionette,
    WorkbenchUI,
    Session,
    SessionsViewTmpl,
    SessionItemTmpl,
    SessionEmptyTmpl
) {

    var SessionItemView = Marionette.ItemView.extend({
        template: SessionItemTmpl,
        tagName: 'tr',

        events: {  
            'click .js-start-session': function() {
                this.trigger('start:session', this.model);
            },
            'click .js-delete-session': function() {
                this.trigger('delete:session', this.model);
            }
        }
    });

  var SessionEmptyView = Marionette.ItemView.extend({
        template: SessionEmptyTmpl,

        onRender: function() {
            $('thead').hide();
        },

        onClose: function() {
            $('thead').show();          
        }
    });

    // Represents the table view, which is using the ListItemView to render its items:
    var SessionsView = Backbone.Marionette.CompositeView.extend({
        template: SessionsViewTmpl,
        itemView: SessionItemView,
        emptyView: SessionEmptyView,

        initialize: function() {
            this.listenTo(this, 'itemview:start:session', function(itemview) {
                console.log('Starting session: ' + itemview.model.get('label'));
                WorkbenchUI.vent.trigger('module:sessionmanager:show');
            });

            this.listenTo(this, 'itemview:delete:session', function(itemview) {
                console.log('Deleting session: ' + itemview.model.get('label'));

                this.collection.remove(itemview.model);
            });
        },

        events: {
            'click .js-new': function() {
                var label = 'MyNewSession',
                    session = new Session();

                if (this.ui.label.val() !== '') {
                    label = this.ui.label.val();
                    session.set('label', label);
                }

                session.save().then(function() {
                    console.log('[Welcome] Successfully created new session: "' + session.get('label') + '"');
                    console.log('Session configuration:');
                    console.log(session.toJSON());

                    this.collection.add(session);
                }.bind(this));
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