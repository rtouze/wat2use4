// Test file to test wat2use4 server
// These are system tests, they needs mongoDb server end express to run

var superagent = require('superagent'),
    should = require('chai').should();

describe('database is OK', function () {
    it('should create a new poll', function (done) {
        superagent.post('http://localhost:3000/poll_submit')
        .send({'question' : 'lol?'})
        .end(function (error, res) {
            should.not.exist(error);
            res.text.length.should.equal(24);
            done();
        });
    });

    it('should retrieve a poll', function (done) {
        superagent.post('http://localhost:3000/poll_submit')
        .send({'question' : 'lol?'})
        .end(function (error, res) {
            var _id = res.text;
            superagent.get('http://localhost:3000/' + _id + '/refresh')
            .end(function (err2, res2) {
                should.not.exist(err2);
                res2.body.question.should.equal('lol?');
                done();
            });
        });
    });

    it('should update the poll 2000 times', function (done) {
        superagent.post('http://localhost:3000/poll_submit')
        .send({'question' : 'lol?'})
        .end(function (error, res) {
            var _id = res.text;
            var externalErr = null;
            for (var i = 0; i < 2000 ; i++) {
                //console.log('_id = ' + _id);
                superagent.post('http://localhost:3000/' + _id + '/update')
                .send({poll: {_id: _id,
                    timeline: ['time', 'line'],
                    voteCount: i,
                    result: {}
                }})
                .end(function (err2, res2) {
                    externalErr = err2;
                });
            }
            should.not.exist(externalErr);
            done();
        });
    });
});

