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
        initialize: function(options) { //***
            //alert("1");
            console.log("options.myTableView = " + options.myTableView );
            //this.stuff = options.stuff;            
        },
        cellClicked: function(){
            //alert(this.model.escape("value"));
            var data =      this.model.toJSON();
            var aKey =      data["key"];
            var aValue =    data["value"];
            //alert("Key: " + aKey + " og Value: " + aValue);
            
            var newValue = prompt("Please enter the new value",aValue);            
            this.model.set({"key": aKey, "value": newValue});
            this.model.save();
        },
        modelEvents: {
            'change': 'fieldsChanged'
        },

        fieldsChanged: function() {
            this.render();
            // console.log("save next.");
            // this.model.save();
            // console.log("save done.");
            // //alert("this.parentModel = " + this.parentModel);
        }
    });

    // Represents the table view, which is using the ListItemView to render its items:
    var TableView = Backbone.Marionette.CompositeView.extend({
        tagName: "table",
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
            fileid: "#fileid-region",

        },

        events: {
            'click .js-next': function() {
                console.log('next clicked');
                WorkbenchUI.vent.trigger('module:metadataextractor:show');
            },
            'click .js-previous': function() {
                console.log('previous');
                WorkbenchUI.vent.trigger('module:sessionmanager:show');
            }
        },

        initialize: function() {

        },

        updateBuildmData: function(model) {
            this.fileid.show(new TableView({
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

    return FileIdLayout;
});