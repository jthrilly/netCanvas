/* global require, console, global.tools.notify, session */
/* exported IOInterface */


/*

This module should provide a transparent interface for any part of the application to store data.

It functions as a key/value store.

  - The requesting module first requests a data slot, or recieves a pointer to an existing one. If a data slot
    with the specified key already exists, the pointer is returned, else a new pointer is generated along with
    the slot.
  - The ioInterface instance decides when the key store should be synced with the external data store vs. the
    local backup (localStorage API), but this syncing can be triggered manually.
  - Only keys that have been modified should be synced to avoid large data transfer.

*/

var IOInterface = function IOInterface() {

    // this could be a remote host
    // Type 3: Persistent datastore with automatic loading
    var Datastore = require('nedb');
    var path = require('path');
    var db;
    var id;
    var interface = {};

    interface.init = function(callback) {
        global.tools.notify('ioInterface initialising.', 1);
        db = new Datastore({ filename: path.join(window.require('nw.gui').App.dataPath, 'NetworkCanvas.db'), autoload: true });

        if (window.localStorage.getObject('activeSession')!== false) {
            console.log('existing session found');
            callback(window.localStorage.getObject('activeSession'));
        } else {
            console.log('no existing session');

            db.insert([{ NetworkCanvas:'initialised'}], function (err, newDoc) {
                if(err) {
                  // do something with the error
                    console.log('error with insert');
                }
                console.log(newDoc);
                console.log(newDoc[0]._id);

                // Two documents were inserted in the database
                // newDocs is an array with these documents, augmented with their _id
                id = newDoc[0]._id;
                console.log('id has been set as '+id);
                window.localStorage.setObject('activeSession', id);
                callback(newDoc[0]._id);
          });

        }

    };


    interface.save = function(userData, id) {
        delete global.session.userData._id;
        global.tools.notify('IOInterface being asked to synchronise with data store:',2);
        global.tools.notify('Data to be saved: ', 1);
        global.tools.notify(userData, 1);

        db.update({_id: id }, userData, {}, function (err) {
            if (err) {
                console.log('saving failed');
            }

            console.log('saving worked...id for find: '+id);
            db.find({"_id": id }, function (err, docs) {
                if (err) {
                    console.log('error with finding');
                    console.log(err);
                    // handle error
                }
                console.log('data is now: ');
                console.log(docs[0]);
            });
        });

    };

    interface.update = function(key, userData,id) {
        db.update({_id: id }, userData, {}, function (err) {
            if (err) {
                console.log('saving failed');
            }

            console.log('update worked.');
            db.find({"_id": id }, function (err, docs) {
                if (err) {
                    console.log('error with finding');
                    console.log(err);
                    // handle error
                }
                console.log('new data is: ');
                console.log(docs[0]);
            });
        });

    };

    interface.reset = function(callback) {
        // db.find with empty object returns all objects.
        db.find({}, function (err, docs) {
            if (err) {
                console.log('resetting failed');
                return false;
            }

            var resultLength = docs.length;
            for (var i = 0; i < resultLength; i++) {
                interface.deleteDocument(docs[i]._id);
            }

            if (callback) { callback(); }
        });
    };

    interface.deleteDocument = function(id) {
        db.remove({ _id: id }, {}, function (err) {
            if (err) { console.log('deleting document failed.'); return false; }
        });
    };

    interface.load = function(callback, id) {
        console.log('loading...id is '+id);
        global.tools.notify("ioInterface being asked to load data.", 2);
        db.find({"_id": id}, function (err, docs) {
            if (err) {
                // handle error
                console.log('error');
            }
            console.log('loading worked. Returning: ');
            console.log(docs[0]);
            callback(docs[0]);
        });
    };

    return interface;
};

module.exports = new IOInterface();
