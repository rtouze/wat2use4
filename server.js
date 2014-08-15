// Main part of app server side.

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var pollRepo = require('./model/poll_repository.js');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
      extended: true
}));

// Default route
app.get('', function (req, res) {
    'use strict';
    res.render('index', {title: 'Ma page avec express'});
});

// Default route
app.get('/', function (req, res) {
    'use strict';
    res.render('index', {title: 'Ma page avec express'});
});

// Poll creation.
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
    });

});

// Serve page for a specific poll if it exists
app.get('/:pollId', function (req, rep) {
    'use strict';
    console.log("on demande le poll " + req.params.pollId);
    var pid = req.params.pollId;
    try {
        pollRepo.getById(pid, function (result) {
            rep.render('wat2use4', {poll: result});
        });
    }
    catch(e) {
        res.send("pollId " + req.params.pollId + " not found");
    }
});

// Refresh the poll. Send it back as a JSON object.
app.get('/:pollId/refresh', function (req, rep) {
    'use strict';
    var pid = req.params.pollId;
    console.log("refresh, pid " + pid);
    try {
        pollRepo.getById(pid, function (poll) {
            rep.send(poll);
        });
    }
    catch(e) {
        res.send("pollId " + req.params.pollId + " not found");
    }
});

// Update poll when a new line is inserted.
app.post('/:pollId/update', function (req, rep) {
    console.log('on est dans post sur le poll/update');
    console.log(req.param('poll'));
    var poll = req.param('poll');
    console.log('poll ' + JSON.stringify(poll));
    try {
        pollRepo.save(poll, function () {
            rep.send('OK');
            // emit a push notification on pollId namespace
            console.log('Push update on socket');
            io.to(poll._id).emit('refresh', undefined);
        });
    }
    // or a fat nasty exception but OSEF for now...
    catch(e) {
        res.send("pollId " + req.params.pollId + " not found");
    }
});

app.use(function (err, req, res, next) {
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.send(err.status || 500, { error: err.message });
});

// Persistant connection to database
pollRepo.connectDb( function () {
    http.listen(3000, function () {
        console.log('app up and running on 3000...');
    });
});

// Initialise socket.io room at client connection
io.on('connection', function (socket) {
    console.log('Client connected to socket');
    socket.emit('ok', {});

    socket.on('joinPoll', function (data) {
        console.log('User demand to join ' + data.id);
        socket.join(data.id);
    });
});

