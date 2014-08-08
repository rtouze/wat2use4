// Poll repository to save and retrieve poll 
//
//

var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var ObjectID = mongo.ObjectID;
var mongoHost = 'localhost';
var mongoPort = '27017';
var mongoDb = 'db';
// Connect to the db

var cache = {};

exports.save = function (poll, callback) {
    console.log("Poll._id = " + poll._id);
    if (!poll._id) {
        mongoClient.connect("mongodb://" + mongoHost + ":" + mongoPort + "/" + mongoDb, function(err, db) {
            if(err) { return console.log(err); }
            var collection = db.collection('wat2use4');
            collection.insert(poll, {w: 1}, function (err, result) {
                if(err) { console.log(err); }
                console.log(result);
                callback(poll);
            });
        });
    } else {
        mongoClient.connect("mongodb://" + mongoHost + ":" + mongoPort + "/" + mongoDb, function(err, db) {
            console.log("On update " + poll._id);
            if(err) { return console.log(err); }
            var collection = db.collection('wat2use4');
            collection.update(
                {_id: ObjectID.createFromHexString(poll._id)},
                {$set: {
                           results: poll.results,
                voteCount: poll.voteCount,
                timeline: poll.timeline
                       }},
                       {w: 1},
                       function (err, result) {
                           if(err) { console.log(err); }
                           console.log(result);
                           callback();
                       }
                );
        });
    }
};

exports.getById = function (id, callback) {
    mongoClient.connect("mongodb://" + mongoHost + ":" + mongoPort + "/" + mongoDb, function(err, db) {
        if(err) { return console.log(err); }
        var collection = db.collection('wat2use4');
        collection.findOne({_id: ObjectID.createFromHexString(id)}, function (err, result) {
            if(err) { console.log(err); }
            console.log('get result ' + result);
            callback(result);
        });
    });
};
