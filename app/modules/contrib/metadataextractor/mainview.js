define([
    'backbone.marionette',
    'workbenchui',
    'vendor/rdfstore',
    'vendor/xsd-validation',
    'hbs!./templates/main',
    'hbs!./templates/list-item',
    'hbs!./templates/list-collection'
], function(Marionette, WorkbenchUI, rdfstore, xsd, MetadataViewTmpl, ListItemTmpl, TableTmpl) {
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
            if (newValue !== null) {
                if (!data.value_type || xsd.validate(data.value_type, newValue)) {
                    this.model.set({"key": aKey, "value": newValue, "value_type": data.value_type});
                    this.model.save();
                } else {
                    alert("Value '" + newValue + "' is not valid for type '" + data.value_type + "'");
                }
            }
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
            //stuff: "some stuff here placed is"
            myTableView: this
        },

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
                console.log('next clicked --> module:semanticobservatory:show');
                WorkbenchUI.vent.trigger('module:semanticobservatory:show');   
                console.log('after vent.trigger by click..');
            },
            'click .js-previous': function() {
                console.log('previous');
                WorkbenchUI.vent.trigger('module:fileidentification:show');
            }
        },

        initialize: function() {

        },

        updateBuildmData: function(model) {
            this._rdfBasedModelToCollection(model).then(function(collection) {
                this.buildm.show(new TableView({
                    collection: collection
                }));
            }.bind(this));
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
        },
        
        _rdfBasedModelToCollection: function(model) {
            var defer = $.Deferred();
            var rdf = model.attributes.rdf;
            var s = new rdfstore.Store({}, function(store) {
                store.load("text/turtle", rdf, function(success, results) {
                    store.execute("SELECT * WHERE { $s $p $o . }", function(succes, results) {
                        var collection = new Backbone.Collection();
                        results.forEach(function(result) {
                            var key = result.p.value.indexOf('#') > -1
                                ? result.p.value.split('#')
                                : result.p.value.split('/');
                            key = key[key.length - 1];
                            var val = result.o.value;
                            var ty = result.o.type;
                            collection.push({
                                key: key,
                                value: val,
                                value_type: ty
                            });
                        });                        
                        defer.resolve(collection);
                    });
                });
            });            
            return defer;
        }
    });

    return MetadataLayout;
});