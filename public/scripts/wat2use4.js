/* Javascript for w2u4 client side. 
 * Dependancies :
 *  Jquery 2
 *  socket.io
 * */

$(function () {
    'use strict';
    var question_default = $('#question').html().trim(),
        stats = {},
        vote_count = 0,
        advice_list = [],
        question;

    var pullData = function () {
        var pollId = Number(window.location.pathname.substr(1));
        var  xhr = new XMLHttpRequest();
        var resp;
        xhr.open('GET', '/' + pollId +  '/refresh');
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resp = xhr.responseText;
                console.debug("RESP = " + resp);
                initPage(JSON.parse(resp));
            }
        }
    }();

    var initPage = function (poll) {
        stats = {},
        vote_count = 0,
        advice_list = [];
        stats = poll.results;
        advice_list = poll.timeline;
        vote_count = poll.voteCount;
        question = poll.question;
        $('#question').html(question);
        refreshStatsPlaceHolder(stats);
        render_timeline(advice_list);
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
        advice_list.reverse();
        advice_list.push((new Date()).toISOString() + ' - ' + content);
        advice_list.reverse();
        if (advice_list.length > 10) {
            advice_list.pop();
        }
        render_timeline(advice_list);

        result = content.match(/#(\S+)(\s|$|\.)/g);
        if (result !== null) {
            var adaptedResult = result.map(
                    function (item) { return item.trim().replace(/(^#|\s|\.)/g, '').toLowerCase(); }
                    );
            var i = 0;
            var currentResult;
            for (i = 0; i < adaptedResult.length; i++) {
                currentResult = adaptedResult[i];
                if (stats[currentResult] === undefined) {
                    stats[currentResult] = 0
                }
                stats[currentResult] += 1;
                vote_count += 1;
                refreshStatsPlaceHolder(stats);
            }
        } 

        var pollId = Number(window.location.pathname.substr(1));
        if (pollId !== NaN) {
            var pollChange = {id: pollId,
                timeline: advice_list,
                results: stats,
                voteCount: vote_count,
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

    var refreshStatsPlaceHolder = function (stats) {
        'use strict';
        // TODO: write sorted list
        var $placeHolder = $('div#result_place_holder'),
            $resultList = $('<ul>'),
            $currentAdviceElement,
            size, min_size, calculated_size;
        console.debug('vote_count = ' + vote_count)
            min_size = 0.8;

        for (advice in stats) {
            calculated_size = Number(stats[advice])*2.5/vote_count
            size =  calculated_size < min_size ? min_size : calculated_size;
            console.debug('Size ' + size)
            $currentAdviceElement = $('<li>' + advice + ': ' + stats[advice] + '</li>');
            $currentAdviceElement.css('font-size', size + 'em')
            $resultList.append($currentAdviceElement);
        }
        $placeHolder.empty().append($resultList);
    };

});

