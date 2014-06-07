define([
    'backbone.marionette',
    'workbenchui',
    'hbs!./templates/main',
    'hbs!./templates/list-item',
    'hbs!./templates/list-collection'
], function(Marionette, WorkbenchUI, MetadataViewTmpl, ListItemTmpl, TableTmpl) {
    // Represents on list item:
    var ListItemView = Backbone.Marionette.ItemView.extend({
        template: ListItemTmpl,
        tagName: 'tr'
    });

    // Represents the table view, which is using the ListItemView to render its items:
    var TableView = Backbone.Marionette.CompositeView.extend({
        tagName: "table",
        className: 'table table-striped',
        template: TableTmpl,
        itemView: ListItemView,

        appendHtml: function(collectionView, itemView) {
            collectionView.$("tbody").append(itemView.el);
        }
    });

    // Represents the main page, including the TableView in the 'list' region when the 'onShow' method is called:
    var MetadataLayout = Backbone.Marionette.Layout.extend({
        template: MetadataViewTmpl,

        regions: {
            buildm: "#buildm-region"
        },

        events: {
            'click .js-next': function() {
                console.log('next clicked');
                WorkbenchUI.vent.trigger('module:semanticenrichment:show');
            },
            'click .js-previous': function() {
                console.log('previous');
                WorkbenchUI.vent.trigger('module:fileidentification:show');
            }
        },

        initialize: function() {
            // Here the given model (stored in this.options.model) is converted into
            // a collection for easier display. CAUTION: After values have changed int
            // the collection it is necessary to serialize the collection into a single
            // model to store it back to the server!

            this.metadataCollection = new Backbone.Collection();
            for (var key in this.options.model.attributes) {
                // Skip 'id' attribute:
                if (key === 'id') continue;

                var value = this.options.model.attributes[key];
                this.metadataCollection.push({
                    key: key,
                    value: value
                });
            };
        },

        onShow: function() {
            this.buildm.show(new TableView({
                collection: this.metadataCollection
            }));
        }
    });

    return MetadataLayout;
});