/* Javascript for w2u4 client side. 
 * Dependances :
 *  Jquery 2
 *  socket.io
 * */

$(function () {
    'use strict';
    var question_default = $('#question').html().trim(),
        stats = {};

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

    $('button#advice_submit').click(function () {
        var $advice = $('input#advice'),
        content = $advice.val().trim(),
        result,
        // We can put  a datetime on it...
        $pushed_advice = $('<div class="tl_advice">');

        $pushed_advice.html(content);
        $('div#timeline').append($pushed_advice);

        // TODO : regarder comment recuperer tous les groupes (la on ne
        // recupere que l'index, c'est useless
        var result = content.match(/#(\S+)(\s|$|\.)/g);
        // STOP: needs testing
        if (result !== null) {
            var adaptedResult = result.map(
                    function (item) { return item.trim().replace(/(^#|\s|\.)/g, ''); }
                    );
            var i = 0;
            var currentResult;
            for (i = 0; i < adaptedResult.length; i++) {
                currentResult = adaptedResult[i];
                if (stats[currentResult] === undefined) {
                    stats[currentResult] = 0
                }
                stats[currentResult] += 1;
                refreshStatsPlaceHolder();
            }
        } else {
        }
    });

    var refreshStatsPlaceHolder = function () {
        'use strict';
        // TODO: write sorted list
        var $placeHolder = $('div#result_place_holder'),
            $resultList = $('<ul>'),
            $currentAdviceElement;
        for (advice in stats) {
            $resultList.append(
                    $('<li>' + advice + ': ' + stats[advice] + '</li>')
                    );
        }
        $placeHolder.empty().append($resultList);
    };
});
