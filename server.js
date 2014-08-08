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

// Marche pas...
//http.listen(80);

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
    pollRepo.getById(pid, function (result) {
        rep.render('wat2use4', {poll: result});
        //rep.send(JSON.stringify(poll));
        //TODO : send err fonction
    });
});

app.get('/:pollId/refresh', function (req, rep) {
    'use strict';
    var pid = req.params.pollId;
    console.log("refresh, pid " + pid);
    pollRepo.getById(pid, function (poll) {
        rep.send(JSON.stringify(poll));
    });
});

app.post('/:pollId/update', function (req, rep) {
    console.log('on est dans post sur le poll/update')
    console.log(req.param('poll'));
    var poll = req.param('poll');
    console.log('poll ' + JSON.stringify(poll));
    pollRepo.save(poll, function () {
        rep.send('OK');
    });
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

//io.on('connection', function (socket) {
//    console.log('user connected');
//});
