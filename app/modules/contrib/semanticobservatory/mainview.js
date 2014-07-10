define([
    'backbone.marionette',
    'workbenchui',
    'hbs!./templates/main',
    'hbs!./templates/list-item-default',
    'hbs!./templates/list-collection-default',
    'hbs!./templates/list-item-search',
    'hbs!./templates/list-collection-search'
], function(Marionette, WorkbenchUI, SemanticObservatoryTmpl, ListItemTmpl, TableTmpl, ListItemTmpl2, TableTmplSearch) {
    // Represents on list item:
    var ListItemView = Backbone.Marionette.ItemView.extend({        
        template: ListItemTmpl,
        //template = getTemplate(),
        // getTemplate: function(){
        //     //JSON.stringify
        //     console.log('Inside of getTemplate.. JSON.stringify(this.model..) = ' + this.model.get("value")["dataset_name"]  ); //Two different approaches needed to get content out of model!!
        //     if ( this.model.get("value")["dataset_name"] ){
        //         console.log('get("value.dataset_name") er true -> ListItemTmpl brukes');  
        //         return ListItemTmpl;
        //     } else {

        //         console.log('get("value.dataset_name") er false -> ListItemTmpl2 brukes'); //**
        //         return ListItemTmpl2;
        //     }
        // },
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

    var ListItemView2 = Backbone.Marionette.ItemView.extend({        
        template: ListItemTmpl2,
        tagName: 'tr',
        events: {
            "click td": "cellClicked"
        },
        initialize: function(options) {
            console.log("options.myTableView fra ListItemView2 = " + options.myTableView );         
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

    var TableViewSearch = Backbone.Marionette.CompositeView.extend({
        tagName: "table",
        className: 'table table-striped',
        template: TableTmplSearch,
        itemView: ListItemView2,
        itemViewOptions: {
            myTableView: this
        },

        appendHtml: function(collectionView, itemView) {
            collectionView.$("tbody").append(itemView.el);
        }
    });


    // Represents the main page, including the TableView in the 'list' region when the 'onShow' method is called:
    var SematicObservatoryLayout = Backbone.Marionette.Layout.extend({
        template: SemanticObservatoryTmpl,

        regions: {
            semobs: "#semobs-region" 
        },

        events: {
            'click .js-next': function() {
                console.log('next clicked');
                WorkbenchUI.vent.trigger('module:semanticenrichment:show');
            },
            'click .js-previous': function() {
                console.log('previous');
                WorkbenchUI.vent.trigger('module:metadataextractor:show');
            },
            'click .js-search': function() {   
                //Show spinner while we wait for search results from Probado             
                document.getElementById("semobs-region").innerHTML = '<img src="spinner.gif" alt="spinner"><p>Waiting for webservice to provide fresh info</p>';
                var aSearchterm = $("#searchstringinput").val();
                WorkbenchUI.vent.trigger('module:semanticobservatory:show', aSearchterm);
            }
        },

        initialize: function() {

        },

        updateBuildmData: function(model) {
            //if ( model.get("value")["dataset_name"] ){
            console.log("typeof model = " + typeof model);
            console.log( JSON.stringify( model ) );
            console.log('model.length=' + model.length);
            if(typeof model === undefined ){
                alert('Sorry, nothing found. Please try again.');
               // return; //TODO: handle zero-results a bit more classy.. a seperate view??
            } else {                
                if ( model.get("0")["dataset_name"] ){
                    console.log('==> alt 1');
                    this.semobs.show(new TableView({
                        collection: this._modelToCollection(model)
                    }));
                } else {
                    console.log('==> alt 2');
                    this.semobs.show(new TableViewSearch({
                        collection: this._modelToCollection(model)
                    }));
                    
                };
            };
            // this.semobs.show(new TableView({
            //     collection: this._modelToCollection(model)
            // }));
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

    return SematicObservatoryLayout;
});