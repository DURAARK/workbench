define([
    'backbone.marionette',
    'workbenchui',
    'hbs!./templates/main',
    'hbs!./templates/list-item',
    'hbs!./templates/list-collection',
    'hbs!./templates/empty'
], function(Marionette, WorkbenchUI, MetadataViewTmpl, ListItemTmpl, TableTmpl, EmptyTmpl) {
    // Represents on list item:
    var ListItemView = Backbone.Marionette.ItemView.extend({
        template: ListItemTmpl,
        tagName: 'tr'
    });

    var EmptyView = Backbone.Marionette.ItemView.extend({
        template: EmptyTmpl
    });

    // Represents the table view, which is using the ListItemView to render its items:
    var TableView = Backbone.Marionette.CompositeView.extend({
        tagName: 'table',
        className: 'table table-striped',
        template: TableTmpl,
        itemView: ListItemView,
        itemViewOptions: {
            myTableView: this
        },

        appendHtml: function(collectionView, itemView) {
            collectionView.$("tbody").append(itemView.el);
        }
    });

    // Represents the main page, including the TableView in the 'list' region when the 'onShow' method is called:
    var FileIdLayout = Backbone.Marionette.Layout.extend({
        template: MetadataViewTmpl,

        regions: {
            fileid: "#fileid-region"
        },

        events: {
            'click .js-next': function() {
                WorkbenchUI.vent.trigger('module:metadataextractor:show');
            },
            'click .js-previous': function() {
                WorkbenchUI.vent.trigger('module:filemanager:show');
            },
            'click .js-home': function() {
                WorkbenchUI.vent.trigger('module:landingpage:show');
            },
        },

        // e.g. no E57 file found in session:
        showEmptyView: function() {
            this.fileid.show(new EmptyView());
        },

        updateBuildmData: function(model) {
            var collection = new Backbone.Collection();
            collection.add(model);

            this.fileid.show(new TableView({
                collection: collection
            }));
        }
    });

    return FileIdLayout;
});