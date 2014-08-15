/* Javascript for w2u4 client side. 
 * Dependancies :
 *  Jquery 2
 *  socket.io
 * */

var Model = {
    Timeline: function (tlList) {
        'use strict';
        var list = tlList;
        var asList = function () {
            return list;
        };
        var append = function (content) {
            list.reverse();
            list.push((new Date()).toISOString() + ' - ' + content);
            list.reverse();
            if (list.length > 10) {
                list.pop();
            }
        };
        return {asList: asList, append: append};
    }
};

$(function () {
    'use strict';
    var pollId = window.location.pathname.substr(1);
    var socket = io();

    var results = {},
        voteCount = 0,
        timeline = [],
        question;

    // Get poll data through XHR
    var pullData = function () {
        var  xhr = new XMLHttpRequest();
        var resp;
        xhr.open('GET', '/' + pollId +  '/refresh');
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resp = xhr.responseText;
                initPage(JSON.parse(resp));
            }
        }
    };

    var initPage = function (poll) {
        results = poll.results;
        timeline = poll.timeline;
        voteCount = poll.voteCount;
        question = poll.question;
        $('#question').html(question);
        refreshStatsPlaceHolder(results);
        render_timeline(timeline);
    }

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
        timeline.reverse();
        timeline.push((new Date()).toISOString() + ' - ' + content);
        timeline.reverse();
        if (timeline.length > 10) {
            timeline.pop();
        }
        render_timeline(timeline);

        result = content.match(/#(\S+)(\s|$|\.)/g);
        if (result !== null) {
            var adaptedResult = result.map(
                    function (item) { return item.trim().replace(/(^#|\s|\.)/g, '').toLowerCase(); }
                    );
            var i = 0;
            var currentResult;
            for (i = 0; i < adaptedResult.length; i++) {
                currentResult = adaptedResult[i];
                if (results[currentResult] === undefined) {
                    results[currentResult] = 0
                }
                results[currentResult] += 1;
                voteCount += 1;
                refreshStatsPlaceHolder(results);
            }
        } 

        var pollChange = {_id: pollId,
            timeline: timeline,
            results: results,
            voteCount: voteCount,
            question: question};
        var xhr = new XMLHttpRequest();
        var data = {'poll': pollChange};
        xhr.open('POST', '/' + pollId + '/update', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader("Content-length", data.length);
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.info('Data send to server');
            }
        }
    });

    var render_timeline = function (timelineee) {
        $('div#timeline').empty();
        for (var i = 0; i < timelineee.length; i++) {
            var $pushed_advice = $('<div class="tl_advice">');
            $pushed_advice.html(timelineee[i].replace(/#(\S+)(\s|$|\.)/g, '<em>$&</em>'));
            $('div#timeline').append($pushed_advice);
        }
    };

    var refreshStatsPlaceHolder = function (results) {
        'use strict';
        // TODO: write sorted list
        var $placeHolder = $('div#result_place_holder'),
            $resultList = $('<ul>'),
            $currentAdviceElement,
            size, min_size, calculated_size;
            min_size = 0.8;

        for (advice in results) {
            calculated_size = Number(results[advice])*2.5/voteCount
            size =  calculated_size < min_size ? min_size : calculated_size;
            $currentAdviceElement = $('<li>' + advice + ': ' + results[advice] + '</li>');
            $currentAdviceElement.css('font-size', size + 'em')
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
        pullData();
    });
});

