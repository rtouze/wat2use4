// Main part of app server side.

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var pollRepo = require('./model/poll_repository.js');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var debug = require('debug')('express');
var renderIndex = function (res) {
    res.render('index');
};

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
    renderIndex(res);
});

// Default route
app.get('/', function (req, res) {
    'use strict';
    renderIndex(res);
});

// Poll creation.
app.post('/poll_submit', function (req, res) {
    'use strict';
    debug('I received ' + req.param('question'));
    var poll = {
        question: req.param('question'),
        creationDate: new Date(),
        timeline: [],
        results: {},
        voteCount: 0
    };
    try {
        pollRepo.save(poll, function (savedPoll) {
            res.send(savedPoll._id.toHexString());
        });
    }
    catch(e) {
        res.send(500, e);
    }
});

// Serve page for a specific poll if it exists
app.get('/:pollId', function (req, rep) {
    'use strict';
    debug("on demande le poll " + req.params.pollId);
    var pid = req.params.pollId;
    try {
        pollRepo.getById(pid, function (result) {
            rep.render('wat2use4', {poll: result});
        });
    }
    catch(e) {
        rep.send(404, "pollId " + req.params.pollId + " not found (" + e + ").");
    }
});

// Refresh the poll. Send it back as a JSON object.
app.get('/:pollId/refresh', function (req, rep) {
    'use strict';
    var pid = req.params.pollId;
    debug("refresh, pid " + pid);
    try {
        pollRepo.getById(pid, function (poll) {
            rep.send(poll);
        });
    }
    catch(e) {
        res.send(404, "pollId " + req.params.pollId + " not found (" + e + ").");
    }
});

// Update poll when a new line is inserted.
app.post('/:pollId/update', function (req, rep) {
    debug('on est dans post sur le poll/update');
    debug(req.param('poll'));
    var poll = req.param('poll');
    debug('poll ' + JSON.stringify(poll));
    try {
        pollRepo.save(poll, function () {
            rep.send('OK');
            // emit a push notification on pollId namespace
            debug('Push update on socket');
            io.to(poll._id).emit('refresh', undefined);
        });
    }
    // or a fat nasty exception but OSEF for now...
    catch(e) {
        res.send(404, "pollId " + req.params.pollId + " not found (" + e + ").");
    }
});

app.use(function (err, req, res, next) {
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.send(err.status || 500, { error: err.message });
});

// Persistant connection to database
pollRepo.connectDb( function () {
    var port = process.env.PORT || 3000
    http.listen(port, function () {
        console.log('app up and running on ' + port  + '...');
    });
});

// Initialise socket.io room at client connection
io.on('connection', function (socket) {
    debug('Client connected to socket');
    socket.emit('ok', {});

    socket.on('joinPoll', function (data) {
        debug('User demand to join ' + data.id);
        socket.join(data.id);
    });
});

