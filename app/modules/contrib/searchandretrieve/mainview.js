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
                //Show spinner while we wait for search results from Probado             
                document.getElementById("probado-region").innerHTML = '<img src="spinner.gif" alt="spinner"><p>Waiting for webservice to provide fresh info</p>';
                var aSearchterm = $("#searchstringinput").val();
                WorkbenchUI.vent.trigger('module:searchandretrieve:show', aSearchterm);
            }
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