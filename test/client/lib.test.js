// Mocha test file for lib.js

describe('Timeline', function () {
    it('should reverse on append', function () {
        var tl = Model.Timeline([]);
        tl.append('foo');
        tl.append('bar');
        tl.asList()[0].content.should.equals('bar');
    });
});


describe('resultSorter', function () {
    it('should return 5 highest score values', function () {
        var pollResult = {
            'foo': 40,
            'bar': 100,
            'baz': 10,
            'toto': 5,
            'tata': 1000,
            'tutu': 1
        };
        var newRes = Model.resultSorter(pollResult, 5);
        var expected = [['tata', 1000],
            ['bar', 100],
            ['foo', 40],
            ['baz', 10],
            ['toto', 5]];
        newRes.should.deep.equals(expected);
    });
});


describe('statSizer', function () {
    it('should set max size to 4em', function () {
        var result = 1,
            voteCount = 1,
            cssSize
        cssSize = Model.statSizer(result, voteCount)
        cssSize.should.equals('4em')
    })

    it('should set half max to 2em', function () {
        var result = 1,
            voteCount = 2,
            cssSize
        cssSize = Model.statSizer(result, voteCount)
        cssSize.should.equals('2em')
    })

    it('should handle result as a string', function () {
        var result = '1',
            voteCount = 2,
            cssSize
        cssSize = Model.statSizer(result, voteCount)
        cssSize.should.equals('2em')
    })

    it('should handle vote count as a string', function () {
        var result = 1,
            voteCount = '2',
            cssSize
        cssSize = Model.statSizer(result, voteCount)
        cssSize.should.equals('2em')
    })

    it('should handle both entries as strings', function () {
        var result = '1',
            voteCount = '2',
            cssSize
        cssSize = Model.statSizer(result, voteCount)
        cssSize.should.equals('2em')
    })

    it('should set 0.8em as the minimum size', function () {
        var result = 1,
            voteCount = 100000,
            cssSize
        cssSize = Model.statSizer(result, voteCount)
        cssSize.should.equals('0.8em')
    })
})
;
