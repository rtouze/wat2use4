// Classes and methods for wat2use4. Externalised to allow testing.
var Model = {
    Timeline: function (tlList) {
        'use strict';
        var foolist = tlList;
        var appended = false;

        var asList = function () {
            return foolist;
        };

        var justAppended = function () {
            return appended;
        }

        var toggleAppended = function () {
            appended = !appended;
        }

        var append = function (content) {
            foolist.reverse();
            //foolist.push((new Date()).toISOString() + ' - ' + content);
            foolist.push({date: new Date().toISOString(), content: content})
            foolist.reverse();
            if (foolist.length > 10) {
                foolist.pop();
            }
            appended = true;
        };

        var out = {
            asList: asList,
            append: append,
            justAppended: justAppended,
            toggleAppended: toggleAppended
        };
        return out;
    },

    resultSorter: function (result, returnedCount) {
        'use strict';
        var tmpRes = [];
        for (var key in result) {
            tmpRes.push([key, Number(result[key])])
        }
        return tmpRes.sort( function (a, b) {
            return b[1] - a[1];
        })
        .slice(0, returnedCount);
    },

    statSizer: function (result, voteCount) {
        min_size = .8
        size = result*4/voteCount
        return  (size > min_size ? size : min_size) + 'em';
    }
};
