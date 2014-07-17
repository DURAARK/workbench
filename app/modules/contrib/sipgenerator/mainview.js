define([
    'backbone.marionette',
    'workbenchui',
    'hbs!./templates/main',
    'hbs!./templates/list-item',
    'hbs!./templates/list-collection'
], function(Marionette, WorkbenchUI, SipGeneratorTmpl, ListItemTmpl, TableTmpl) {
    // Represents on list item:
    var ListItemView = Backbone.Marionette.ItemView.extend({
        template: ListItemTmpl,
        tagName: 'tr',
        events: {
            "click td": "cellClicked"
        },
        initialize: function(options) {
            //console.log("options.myTableView = " + options.myTableView );         
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
    var MainView = Backbone.Marionette.Layout.extend({
        template: SipGeneratorTmpl,

        regions: {
            sipgen: "#sipgen-region"
        },

        events: {
            // 'click .js-search': function() {   //TODO -- remove this one??
            //        //Show spinner while we wait for search results from Probado             
            //        document.getElementById("sipgen-region").innerHTML = '<img src="spinner.gif" alt="spinner"><p>Waiting for webservice to provide fresh info</p>';
            //        var aSearchterm = $("#searchstringinput").val();
            //        WorkbenchUI.vent.trigger('module:sipgenerator:show', aSearchterm);
            //    },         
            'click .js-upload': function() {
                alert('Rosetta-SIP generated and uploaded to Rosetta!');
                // WorkbenchUI.vent.trigger('module:searchandretrieve:show');
            },
            'click .js-previous': function() {
                console.log('previous');
                WorkbenchUI.vent.trigger('module:semanticenrichment:show');
            }

        },

        initialize: function() {

        },

        updateBuildmData: function(model) {
            this.sipgen.show(new TableView({
                collection: this._modelToCollection(model) //** TODO: add static placeholde model containg SIP file info here
            }));
        },


        _modelToCollection: function(model) {
            // Here the given model is converted into a collection for easier display.
            // CAUTION: After values have changed in the collection it is necessary to
            // serialize the collection into a single model to store it back to the server!

            var collection = new Backbone.Collection();
            var files = model.get('files');
            for (var file in files) {
                if (files.hasOwnProperty(file)) {
                    collection.push(files[file]);
                }
            };

            return collection;
        }
    });

    return MainView;
});