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
        tagName: 'tr',
        events: {
            "click td": "cellClicked"
        },
        cellClicked: function(){
            //alert(this.model.escape("value"));
            var data =      this.model.toJSON();
            var aKey =      data["key"];
            var aValue =    data["value"];
            //alert("Key: " + aKey + " og Value: " + aValue);
            
            var newValue = prompt("Please enter the new value",aValue);            
            this.model.set({"key": aKey, "value": newValue});
        },
        modelEvents: {
            'change': 'fieldsChanged'
        },

        fieldsChanged: function() {
            this.render();
            this.model.serialize();
        }
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
            buildm: "#buildm-region",
            ifcm: "#ifcm-region",
            e57m: "#e57m-region"
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

        },

        updateBuildmData: function(model) {
            this.buildm.show(new TableView({
                collection: this._modelToCollection(model)
            }));
        },

        updateIfcmData: function(model) {
            this.ifcm.show(new TableView({
                collection: this._modelToCollection(model)
            }));
        },

        updateE57mData: function(model) {
            this.e57m.show(new TableView({
                collection: this._modelToCollection(model)
            }));
        },

        _modelToCollection: function(model) {
            // Here the given model is converted into a collection for easier display.
            // CAUTION: After values have changed in the collection it is necessary to
            // serialize the collection into a single model to store it back to the server!

            var collection = new Backbone.Collection();
            for (var key in model.attributes) {
                // Skip 'id' attribute:
                if (key === 'id') continue;

                var value = model.attributes[key];
                collection.push({
                    key: key,
                    value: value
                });
            };

            return collection;
        }
    });

    return MetadataLayout;
});