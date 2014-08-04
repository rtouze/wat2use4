// Poll repository to save and retrieve poll 
//
//

var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var ObjectID = mongo.ObjectID;
// Connect to the db

var cache = {};
var current_key = 1;

exports.save = function (poll, callback) {
    if (!poll._id) {
        poll.id = current_key;
        mongoClient.connect("mongodb://localhost:27017/db", function(err, db) {
            if(err) { return console.log(err); }
            var collection = db.collection('wat2use4');
            console.log('Collection recuperee');
            console.log('on est bien avec un pollid a -1');
            collection.insert(poll, {w: 1}, function (err, result) {
                if(err) { console.log(err); }
                console.log(result);
                callback(poll);
            });

        });
    }
//    if (poll.id < 0) {
//        poll.id = current_key;
//        current_key += 1;
//    }
//    cache[poll.id] = poll;
};

exports.getById = function (id) {
    mongoClient.connect("mongodb://localhost:27017/db", function(err, db) {
        if(err) { return console.log(err); }
        var collection = db.collection('wat2use4');
        console.log('Collection recuperee');
        console.log('on est bien avec un pollid a -1');
        collection.findOne({id: id}, function (err, result) {
            if(err) { console.log(err); }
            return result;
        });
    });
//    temp = cache[id];
//    return {
//        id: temp.id,
//        results: temp.results || {},
//        timeline: temp.timeline || [],
//        voteCount: temp.voteCount || 0,
//        question: temp.question || 'Undifined question'
//    };
};
