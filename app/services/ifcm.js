define([
  'workbenchui'
], function() {
  WorkbenchUI.module("Services.IFC", function(IFC, WorkbenchUI, Backbone, Marionette, $, _) {

    console.log('Loaded Service: IFC');

    IFC.Metadata = Backbone.Model.extend({
      urlRoot: "db/metadata/ifcm",

      defaults: {
        type: "ifc",
        filesize: "",
        version: ""
      }

    //   validate: function(attrs, options) {
    //     var errors = {}
    //     if (!attrs.firstName) {
    //       errors.firstName = "can't be blank";
    //     }
    //     if (!attrs.lastName) {
    //       errors.lastName = "can't be blank";
    //     } else {
    //       if (attrs.lastName.length < 2) {
    //         errors.lastName = "is too short";
    //       }
    //     }
    //     if (!_.isEmpty(errors)) {
    //       return errors;
    //     }
    //   }
    // });

    IFC.MetadataCollection = Backbone.Collection.extend({
      url: "db/metadata/ifcm",
      model: IFC.Metadata
      // comparator: "firstName"
    });

    IFC.configureStorage(IFC.MetadataCollection);

    var initializeMetadatas = function() {
      contacts = new IFC.MetadataCollection([{
        id: 1,
        firstName: "Alice",
        lastName: "Arten",
        phoneNumber: "555-0184"
      }, {
        id: 2,
        firstName: "Bob",
        lastName: "Brigham",
        phoneNumber: "555-0163"
      }, {
        id: 3,
        firstName: "Charlie",
        lastName: "Campbell",
        phoneNumber: "555-0129"
      }]);
      // contacts.forEach(function(contact) {
      //   contact.save();
      // });
      return contacts.models;
    };

    var API = {
      // getMetadataIFC: function() {
      //   var contacts = new IFC.MetadataCollection();
      //   var defer = $.Deferred();
      //   contacts.fetch({
      //     success: function(data) {
      //       defer.resolve(data);
      //     }
      //   });
      //   var promise = defer.promise();
      //   $.when(promise).done(function(contacts) {
      //     if (contacts.length === 0) {
      //       // if we don't have any contacts yet, create some for convenience
      //       var models = initializeMetadatas();
      //       contacts.reset(models);
      //     }
      //   });
      //   return promise;
      // },

      getMetadataEntity: function(contactId) {
        var contact = new IFC.Metadata({
          id: contactId
        });
        var defer = $.Deferred();
        setTimeout(function() {
          contact.fetch({
            success: function(data) {
              defer.resolve(data);
            },
            error: function(data) {
              defer.resolve(undefined);
            }
          });
        }, 2000);
        return defer.promise();
      }
    };

    // WorkbenchUI.reqres.setHandler("contact:entities", function() {
    //   return API.getMetadataIFC();
    // });

    WorkbenchUI.reqres.setHandler("metadata:ifc", function(id) {
      return API.getMetadataEntity(id);
    });
  });

});