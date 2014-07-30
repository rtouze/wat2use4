// Main part of app server side.

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var pollRepo = require('./model/poll_repository.js')

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
        id: -1,
        question: req.param('question'),
        timeline: [],
        results: {},
        voteCount: 0
    };

    pollRepo.save(poll);
    console.log('poll id = ' + poll.id);
    res.send(String(poll.id));
});

app.get('/:pollId', function (req, rep) {
    'use strict';
    var pid = Number(req.params.pollId);
    var poll = pollRepo.getById(pid);
    // TODO : what if no poll ?
    if (poll) {
        rep.render('wat2use4', {poll: poll})
    } else {
        rep.send('Poll ' + req.params.pollId + ' not found.');
    }
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


