/* Javascript for w2u4 client side. 
 * Dependancies :
 *  jQuery
 *  socket.io 1.0
 * */

DEBUG = true;

// Launched on page load
$(function () {
    'use strict';
    cleanup_storage();
    var $advice_submit = $('#advice_submit'),
        $advice = $('#advice');

    function cleanup_storage() {
        if (!window.localStorage) {
            return;
        }
        var STORAGE_TTL = DEBUG ? 0 : 86400000,  // day of TTL for localstorage keys
            storageLength = window.localStorage.length,
            key, stringVal, i;

        for (i = 0; i < storageLength; i += 1) {
            key = window.localStorage.key(i);
            stringVal = window.localStorage.getItem(key) || '0';
            if (stringVal === 'undefined' || stringVal === '0') {
                window.localStorage.removeItem(key);
                continue
            }
            if (+ new Date - STORAGE_TTL > JSON.parse(stringVal).creation) {
                window.localStorage.removeItem(key);
            }
        }
    }


    var pollId = window.location.pathname.substr(1);
    var socket = io();

    var results = {},
        voteCount = 0,
        timeline,
        question;

    // Get poll data through XHR
    var pullData = function () {
        $.ajax({ url: '/' + pollId +  '/refresh' })
        .done(function (resp) { initPage(resp); });
    };

    var initPage = function (poll) {
        results = poll.results;
        timeline = Model.Timeline(poll.timeline);
        voteCount = Number(poll.voteCount);
        question = poll.question;
        $('#question').html(question);
        refreshStatsPlaceHolder(results);
        renderTimeline(timeline.asList());
    };

    $advice.on('focus', function (event) {
        var initial_content = '# should prefix the terms you vote for.';
        if (event.target.value.trim() === initial_content) {
            event.target.value = '';
        }
    });

    $advice_submit.click(function (evt) {
        var content, result, session;

        if(window.localStorage) {
            session = JSON.parse(window.localStorage.getItem(pollId) || '0');
            if (session && session.answered) {
                $(evt.target).attr('disabled', 'disabled');
                return;
            }
        }
        else return;
        $(evt.target).removeAttr('disabled');


        content = $advice.val().trim();
        timeline.append(content);
        renderTimeline(timeline.asList());

        result = content.match(/#(\S+)(\s|$|\.)/g);
        if (result !== null) {
            var adaptedResult = result.map(
                    function (item) { return item.trim().replace(/(^#|\s|\.)/g, '').toLowerCase(); }
                    );
            var currentResult;
            var adaptedResultLength = adaptedResult.length;
            for (var i = 0; i < adaptedResultLength; i++) {
                currentResult = adaptedResult[i];
                if (results[currentResult] === undefined) {
                    results[currentResult] = 0;
                }
                results[currentResult] = Number(results[currentResult]) + 1;
                voteCount = Number(voteCount) + 1;
                refreshStatsPlaceHolder(results);
            }
        } 

        var pollChange = {
            _id: pollId,
            timeline: timeline.asList(),
            results: results,
            voteCount: voteCount,
            question: question
        };

        $.ajax({
            type: 'POST',
            url: '/' + pollId + '/update',
            data: {'poll': pollChange}
        });

        // Update localStorage
        if (window.localStorage) {
            localStorage.setItem(
                pollId,
                JSON.stringify({creation: +new Date, answered: true})
            );
            $advice.parent().html('Thank you for your advice!<br /><br />Here are the 10 last advices:');
        }
    });

    var renderTimeline = function (timelineAsList) {
        $('div#timeline').empty();
        for (var i = 0; i < timelineAsList.length; i++) {
            var $pushed_advice = $('<div class="tl_advice">');
            $pushed_advice.html(
                    new Date(timelineAsList[i].date).toLocaleString() +
                    ' - ' +
                    timelineAsList[i].content.replace(/#(\S+)(\s|$|\.)/g, '<em>$&</em>'));
            $('div#timeline').append($pushed_advice);
        }
    };

    var refreshStatsPlaceHolder = function (results) {
        var $placeHolder = $('div#result_place_holder'),
            $resultList = $('<ul>'),
            $currentAdviceElement,
            size, 
            sortedResult,
            resultLine;

        sortedResult = Model.FiveFirstResultSorter(results);

        for (var i in sortedResult) {
            resultLine = sortedResult[i];
            size = Model.statSizer(resultLine[1], voteCount);
            $currentAdviceElement = $('<li>' + resultLine[0] + ': ' + resultLine[1] + '</li>');
            $currentAdviceElement.css('font-size', size);
            $resultList.append($currentAdviceElement);
        }
        $placeHolder.empty().append($resultList);
    };

    // Main exec part
    pullData();

    // socket events
    socket.on('ok', function () {
        socket.emit("joinPoll", {id: pollId});
    });

    socket.on('refresh', function (msg) {
        if (!timeline || !timeline.justAppended()) {
            pullData();
        } else {
            if (timeline) {
                timeline.toggleAppended();
            }
        }
    });
});

