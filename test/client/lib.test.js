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
    }) ;
});
