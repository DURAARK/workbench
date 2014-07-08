define([
    'backbone.marionette',
    'workbenchui',
    'vendor/rdfstore',
    'vendor/rdfapi',
    'vendor/xsd-validation',
    'hbs!./templates/main',
    'hbs!./templates/list-item',
    'hbs!./templates/list-collection'
], function(Marionette, WorkbenchUI, rdfstore, rdfapi, xsd, MetadataViewTmpl, ListItemTmpl, TableTmpl) {
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
                    data.value = newValue;
                    this.model.set(data);
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
                this._collectionToRdf(this._buildmCollection).then(function(rdf) {
                    console.log("===============================");
                    console.log(rdf);
                    console.log("===============================");
                    // this.submitRdfToServer(rdf).then(function() {
                    WorkbenchUI.vent.trigger('module:semanticobservatory:show');   
                    console.log('after vent.trigger by click..');
                });
            },
            'click .js-previous': function() {
                console.log('previous');
                WorkbenchUI.vent.trigger('module:fileidentification:show');
            }.bind(this)
        },

        initialize: function() {

        },

        updateBuildmData: function(model) {
            this._rdfBasedModelToCollection(model).then(function(collection) {
                this._buildmCollection = collection;
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
                        var blanks = {};
                        var formatKey = function(a) {
                            var b = a.indexOf('#') > -1
                                ? a.split('#')
                                : a.split('/');
                            return b[b.length - 1];
                        };
                        results.forEach(function(result) {
                            if (result.o.token === 'blank') {
                                blanks[result.o.value] = result;
                            }
                        });
                        results.forEach(function(result) {
                            if (result.o.token !== 'blank') {
                                var key = formatKey(result.p.value);
                                var val = result.o.value;
                                var ty = result.o.type;
                                var blanknode_predicate, blanknode_identifier;
                                blanknode_predicate = blanknode_identifier = null;
                                if (result.s.token === 'blank') {
                                    blanknode_predicate = blanks[result.s.value].p.value;
                                    blanknode_identifier = result.s.value;
                                    key = formatKey(blanks[result.s.value].p.value) + ' > ' + key;
                                }
                                collection.push({
                                    subject: result.s.value,
                                    predicate: result.p.value,
                                    value: val,
                                    value_type: ty,
                                    key: key,
                                    blanknode_predicate: blanknode_predicate,
                                    blanknode_identifier: blanknode_identifier
                                });
                            }
                        });                        
                        defer.resolve(collection);
                    });
                });
            });            
            return defer;
        },
        
        _collectionToRdf: function(collection) {
            var defer = $.Deferred();
            var store = rdfstore.create();
            var rdf = store.rdf;
            var graph = rdf.createGraph();
            var blanks = {};
            collection.forEach(function(model) {
                var attr = model.attributes;
                if (attr.blanknode_identifier) {
                    var li = blanks[attr.blanknode_identifier] || [];
                    li.push(attr);
                    blanks[attr.blanknode_identifier] = li;
                }
            });
            var mainsub = null;
            collection.forEach(function(model) {
                var attr = model.attributes;
                if (attr.blanknode_identifier === null) {
                    graph.add(rdf.createTriple(
                        mainsub || (mainsub = rdf.createNamedNode(attr.subject)),
                        rdf.createNamedNode(attr.predicate),
                        rdf.createLiteral(attr.value, null, attr.value_type)
                    ));
                }
            });
            Object.keys(blanks).forEach(function(nodeId) {
                var attr_list = blanks[nodeId];
                var sub = rdf.createBlankNode();
                var last;
                attr_list.forEach(function(attrs) {
                    graph.add(rdf.createTriple(
                        sub,
                        rdf.createNamedNode(attrs.predicate),
                        rdf.createLiteral(attrs.value, null, attrs.value_type)
                    ));
                    last = attrs;
                });
                graph.add(rdf.createTriple(
                    mainsub,
                    rdf.createNamedNode(last.blanknode_predicate),
                    sub
                ));
            });
            
            new rdfapi.parsers.Turtle(rdfapi.data.context).parse(graph.toNT(), function(graph) {
                defer.resolve(rdfapi.turtle(graph));
            });
            return defer;
        }
    });

    return MetadataLayout;
});