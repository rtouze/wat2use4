// Main part of app server side.

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var pollRepo = require('./model/poll_repository.js')
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var ObjectID = mongo.ObjectID;

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser());

app.get('/', function (req, res) {
    'use strict';
    res.render('index', {title: 'Ma page avec express'});
});

app.post('/poll_submit', function (req, res) {
    'use strict';
    console.log('I received ' + req.param('question'));
    var poll = {
        question: req.param('question'),
        timeline: [],
        results: {},
        voteCount: 0
   
    };


    /*
    pollRepo.save(poll, function (savedPoll) {
        res.send(savedPoll._id.toHexString());
        
    })

    */
    

    mongoClient.connect("mongodb://localhost:27017/db", function(err, db) {
        if(err) { return console.log(err); }
        var collection = db.collection('wat2use4');
        console.log('Collection recuperee');
        console.log('on est bien avec un pollid a -1');
        collection.insert(poll, {w: 1}, function (err, result) {
            if(err) { console.log(err); }
            console.log('Result' + result);
            console.log('result[0]' + result[0]);
            console.log('oh putain ' + poll._id.toHexString());
            res.send(poll._id.toHexString());
        });
    });
});

app.get('/:pollId', function (req, rep) {
    'use strict';
    console.log("on demande le poll " + req.params.pollId);
    // A partir de la, toute cette merde ne marche pas...
    mongoClient.connect("mongodb://localhost:27017/db", function(err, db) {
        if(err) { return console.log(err); }
        var collection = db.collection('wat2use4');
        var oid = ObjectID.createFromHexString(req.params.pollId);
        console.log("objectID = " + oid);
        collection.findOne({_id: oid}, function (err, result) {
            if(err) { 
                rep.send('Poll ' + req.params.pollId + ' not found.');
            }
            console.log("Result ? " + result);
            rep.render('wat2use4', {poll: result});
        });
    });
});

app.get('/:pollId/refresh', function (req, rep) {
    'use strict';
    var pid = Number(req.params.pollId);
    var poll = pollRepo.getById(pid);
    // TODO : handle poll undefined
    rep.send(JSON.stringify(poll));
});

app.post('/:pollId/update', function (req, rep) {
    console.log('on est dans post sur le poll/update')
    console.log(req.param('poll'));
    var poll = req.param('poll');
    console.log('poll ' + JSON.stringify(poll));
    pollRepo.save(poll);
    rep.send('OK');
    // or a fat nasty exception but OSEF for now...
});

var server = app.listen(3000, function () {
    console.log('app up and running on 3000...');
});

app.use(function(err, req, res, next){
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.send(err.status || 500, { error: err.message });
});


