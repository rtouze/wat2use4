/* Javascript for w2u4 client side. 
 * Dependancies :
 *  jQuery
 *  socket.io 1.0
 * */


// Launched on page load
$(function () {
    'use strict';
    var pollId = window.location.pathname.substr(1);
    var socket = io();

    var results = {},
        voteCount = 0,
        timeline,
        question;

    // Get poll data through XHR
    var pullData = function () {
        $.ajax({
            url: '/' + pollId +  '/refresh'
        })
        .done(function (resp) {
            initPage(resp);
        });
    };

    var initPage = function (poll) {
        results = poll.results;
        timeline = Model.Timeline(poll.timeline);
        voteCount = poll.voteCount;
        question = poll.question;
        $('#question').html(question);
        refreshStatsPlaceHolder(results);
        renderTimeline(timeline.asList());
    };

    $('div#advice').on('focus', function (event) {
        var initial_content = 'Type your advice here...';
        if (event.target.textContent.trim() === initial_content) {
            event.target.textContent = '';
        }
    });

    $('div#advice_submit').click(function () {
        var advice, content, result, adviceDiv;
        adviceDiv  = document.querySelector('div#advice');
        content = adviceDiv.textContent.trim();
        timeline.append(content);
        console.log(timeline.justAppended());
        renderTimeline(timeline.asList());

        result = content.match(/#(\S+)(\s|$|\.)/g);
        if (result !== null) {
            var adaptedResult = result.map(
                    function (item) { return item.trim().replace(/(^#|\s|\.)/g, '').toLowerCase(); }
                    );
            //var i = 0;
            var currentResult;
            for (var i = 0; i < adaptedResult.length; i++) {
                currentResult = adaptedResult[i];
                if (results[currentResult] === undefined) {
                    results[currentResult] = 0;
                }
                results[currentResult] += 1;
                voteCount += 1;
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
        // TODO: write sorted list
        var $placeHolder = $('div#result_place_holder'),
            $resultList = $('<ul>'),
            $currentAdviceElement,
            size, min_size, calculated_size;
            min_size = 0.8;

        for (var advice in results) {
            calculated_size = Number(results[advice])*2.5/voteCount;
            size =  calculated_size < min_size ? min_size : calculated_size;
            $currentAdviceElement = $('<li>' + advice + ': ' + results[advice] + '</li>');
            $currentAdviceElement.css('font-size', size + 'em');
            $resultList.append($currentAdviceElement);
        }
        $placeHolder.empty().append($resultList);
    };

    // Main exec part
    pullData();

    socket.on('ok', function () {
        socket.emit("joinPoll", {id: pollId});
    });

    socket.on('refresh', function (msg) {
        if (!timeline || !timeline.justAppended()) {
            pullData();
        }
        else {
            if (timeline) {
                timeline.toggleAppended();
            }
        }
    });
});

