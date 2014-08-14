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
var dbInstance;


exports.connectDb = function (callback) {
    mongoClient.connect("mongodb://" + mongoHost + ":" + mongoPort + "/" + mongoDb, function(err, db) {
        if(err) { console.log(err); }
        dbInstance = db;
        callback();
        });
};

exports.save = function (poll, callback) {
    console.log("Poll._id = " + poll._id);
    if (!poll._id) {
        var collection = dbInstance.collection('wat2use4');
        collection.insert(poll, {w: 1}, function (err, result) {
            if(err) {
                console.log(err);
                throw err;
            }
            callback(poll);
        });
    } else {
            console.log("On update " + poll._id);
            var collection = dbInstance.collection('wat2use4');
            collection.update(
                {_id: ObjectID.createFromHexString(poll._id)},
                { $set: {
                        results: poll.results,
                        voteCount: poll.voteCount,
                        timeline: poll.timeline }},
                       {w: 1},
                       function (err, result) {
                           if(err) { 
                               console.log(err); 
                           throw err;
                           }
                           console.log(result);
                           callback();
                       });
    }
};

exports.getById = function (id, callback) {
        var collection = dbInstance.collection('wat2use4');
        collection.findOne({_id: ObjectID.createFromHexString(id)}, function (err, result) {
            if(err) { console.log(err); }
            console.log('get result ' + result);
            callback(result);
        });
};
