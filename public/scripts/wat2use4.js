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
        advice_list = [];

    $('#question').click(function() {
        $(this).addClass('edit_mode');
    });

    $('#question_submit').click(function () {
        // TODO : remove css class edit_mode
        var $question = $('#question');
        if ($question.html().trim() !== question_default) {
            $question.attr('contenteditable', 'false').addClass('posted');
            $(this).hide();
            $('#advice_placeholder').show();
        }
    });

    $('div#advice').on('focus', function (event) {
        var initial_content = 'Type your advice here...';
        if (event.target.textContent.trim() === initial_content) {
            event.target.textContent = '';
        }
    });

    $('div#advice_submit').click(function () {
        var advice, content, result, $pushed_advice;
        $pushed_advice = $('<div class="tl_advice">');
        advice  = document.querySelector('div#advice');
        content = advice.textContent.trim();

        $pushed_advice.html((new Date()).toISOString() + ' - ' + content);
        advice_list.reverse();
        advice_list.push($pushed_advice);
        advice_list.reverse();
        if (advice_list.length > 10) {
            advice_list.pop();
        }
        render_timeline();

        // TODO : regarder comment recuperer tous les groupes (la on ne
        // recupere que l'index, c'est useless
        var result = content.match(/#(\S+)(\s|$|\.)/g);
        // STOP: needs testing
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
                refreshStatsPlaceHolder();
            }
        } 

        var pollId = Number(window.location.pathname.substr(1));
        if (pollId !== NaN) {
            var pollChange = {id: pollId, timeline: advice_list, results: stats};
            var xhr = new XMLHttpRequest();
            var data = JSON.stringify(pollChange);
            xhr.open('POST', '/poll_submit', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader("Content-length", data.length);
            console.debug('XHR OK');
            //TODO : fix JSON
            //xhr.send(JSON.stringify(data));
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 400) {
                    console.info('Data send to server');
                }
            }
        }

        // and save
        // TODO :
        // * get poll_id
        // * get poll_question
    });

    var render_timeline = function () {
        $('div#timeline').empty();
        for (var i = 0; i < advice_list.length; i++) {
            $('div#timeline').append(advice_list[i]);
        }
    };

    var refreshStatsPlaceHolder = function () {
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
