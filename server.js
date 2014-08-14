// Main part of app server side.

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var pollRepo = require('./model/poll_repository.js')
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser());

app.get('', function (req, res) {
    'use strict';
    res.render('index', {title: 'Ma page avec express'});
});

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

    pollRepo.save(poll, function (savedPoll) {
        res.send(savedPoll._id.toHexString());
    })

});

app.get('/:pollId', function (req, rep) {
    'use strict';
    console.log("on demande le poll " + req.params.pollId);
    var pid = req.params.pollId;
    try {
    pollRepo.getById(pid, function (result) {
        rep.render('wat2use4', {poll: result});
        //TODO : send err fonction
    });
    }
    catch(e) 
    {
        res.send("pollId " + req.params.pollId + " not found");
    }
});

app.get('/:pollId/refresh', function (req, rep) {
    'use strict';
    var pid = req.params.pollId;
    console.log("refresh, pid " + pid);
    try {
        pollRepo.getById(pid, function (poll) {
            rep.send(poll);
        });
    }
    catch(e) 
    {
        res.send("pollId " + req.params.pollId + " not found");
    }
});

app.post('/:pollId/update', function (req, rep) {
    console.log('on est dans post sur le poll/update')
    console.log(req.param('poll'));
    var poll = req.param('poll');
    console.log('poll ' + JSON.stringify(poll));
    try {
        pollRepo.save(poll, function () {
            rep.send('OK');
        });
        io.emit('refresh', undefined);
    }
    // or a fat nasty exception but OSEF for now...
    catch(e) 
    {
        res.send("pollId " + req.params.pollId + " not found");
    }
});


app.use(function(err, req, res, next){
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.send(err.status || 500, { error: err.message });
});

pollRepo.connectDb( function () {
    http.listen(3000, function () {
        console.log('app up and running on 3000...');
    });
});

