// Poll repository to save and retrieve poll 
//
//

var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var ObjectID = mongo.ObjectID;
var debug = require('debug')('model:poll_repository');
var localMongoUri = "mongodb://localhost:27017/db";
var mongoUri = process.env.MONGOLAB_URI ||
               process.env.MONGOHQ_URL ||
               localMongoUri;
var dbInstance;


// Connect to the db
exports.connectDb = function (callback) {
    debug('Connecting to mongo at ' + mongoUri);
    mongoClient.connect(mongoUri, function(err, db) {
        if(err) {
            throw err;
        }
        dbInstance = db;
        callback();
        });
};

exports.save = function (poll, callback) {
    debug("Poll._id = " + poll._id);
    var collection = dbInstance.collection('wat2use4');
    if (!poll._id) {
        collection.insert(poll, { w: 1 }, function (err, result) {
            if(err) {
                throw err;
            }
            callback(poll);
        });
    } else {
            debug("On update " + poll._id);
            collection.update(
                { _id: ObjectID.createFromHexString(poll._id) },
                { $set: {
                        results: poll.results,
                        voteCount: poll.voteCount,
                        timeline: poll.timeline }},
                        { w: 1 },
                       function (err, result) {
                           if(err) { 
                               throw err;
                           }
                           debug(result);
                           callback();
                       });
    }
};

exports.getById = function (id, callback) {
        var collection = dbInstance.collection('wat2use4');
        collection.findOne({ _id: ObjectID.createFromHexString(id) }, function (err, result) {
            if(err) {
                throw err;
            }
            debug('get result ' + result);
            callback(result);
        });
};
