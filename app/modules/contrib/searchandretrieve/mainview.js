define([
    'backbone.marionette',
    'workbenchui',
    'hbs!./templates/main',
    'hbs!./templates/list-item',
    'hbs!./templates/list-collection'
], function(Marionette, WorkbenchUI, SemanticObservatoryTmpl, ListItemTmpl, TableTmpl) {
    // Represents on list item:
    var ListItemView = Backbone.Marionette.ItemView.extend({        
        template: ListItemTmpl,
        tagName: 'tr',
        events: {
            "click td": "cellClicked"
        },
        initialize: function(options) {
            console.log("options.myTableView = " + options.myTableView );         
        },


        fieldsChanged: function() {
            this.render();
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
    var SearchAndRetriveLayout = Backbone.Marionette.Layout.extend({
        template: SemanticObservatoryTmpl,

        regions: {
            probado: "#probado-region" 
        },

        events: {
        	'click .js-search': function() {
                console.log('===> Probado search clicked!!');
                var aSearchterm = $("#searchstringinput").val();
                alert("Textbox contains: " + aSearchterm);
                //updateBuildmData(workbenchui.fetch())
                WorkbenchUI.vent.trigger('module:searchandretrieve:show', aSearchterm);
            }


            // 'click .js-next': function() {
            //     console.log('next clicked');
            //     WorkbenchUI.vent.trigger('module:semanticenrichment:show');
            // },
            // 'click .js-previous': function() {
            //     console.log('previous');
            //     WorkbenchUI.vent.trigger('module:metadataextractor:show');
            // }
        },

        initialize: function() {

        },

        updateBuildmData: function(model) {
            this.probado.show(new TableView({
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

    return SearchAndRetriveLayout;
});