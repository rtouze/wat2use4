// Mocha test file for lib.js

describe('Timeline', function () {
    it('should reverse on append', function () {
        var tl = Model.Timeline([]);
        tl.append('foo');
        tl.append('bar');
        tl.asList()[0].content.should.equals('bar');
    });
});
