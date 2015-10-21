// Classes and methods for wat2use4. Externalised to allow testing.

;

(function (global, undefined) {
    'use strict';
    var resultSorter = function (result, returnedCount) {
        var tmpRes = [],
            key

        for (key in result) {
            tmpRes.push([key, Number(result[key])])
        }

        return tmpRes.sort( function (a, b) {
            return b[1] - a[1]
        }).slice(0, returnedCount)
    }

    global.Model = {
        Timeline: function (tlList) {
            var foolist = tlList,
                appended = false,
                asList,
                justAppended,
                toggleAppended,
                append

            asList = function () {
                return foolist
            }

            justAppended = function () {
                return appended
            }

            toggleAppended = function () {
                appended = !appended
            }

            append = function (content) {
                foolist.reverse()
                foolist.push({date: new Date().toISOString(), content: content})
                foolist.reverse()
                if (foolist.length > 10) {
                    foolist.pop()
                }
                appended = true
            }

            return {
                asList: asList,
                append: append,
                justAppended: justAppended,
                toggleAppended: toggleAppended
            }
        },

        statSizer: function (result, voteCount) {
            var min_size = .8,
                size = result*4/voteCount
            return  (size > min_size ? size : min_size) + 'em'
        },

        FiveFirstResultSorter: function (result) {
            return resultSorter(result, 5)
        }
    };
})(window)
;
