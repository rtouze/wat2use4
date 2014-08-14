// Test file to test wat2use4 server
// These are system tests, they needs mongoDb server end express to run

var superagent = require('superagent');
var expect = require('expect.js');

describe('database is OK', function () {
    it('should create a new poll', function (done) {
        superagent.post('http://localhost:3000/poll_submit')
        .send({'question' : 'lol?'})
        .end(function (error, res) {
            expect(error).to.be(null);
            expect(res.text.length).to.be(24);
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
                expect(err2).to.be(null);
                expect(res2.body.question).to.be('lol?');
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
            expect(externalErr).to.be(null);
            done();
        });
    });
});

