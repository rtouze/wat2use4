/* Javascript for w2u4 client side. 
 * Dependances :
 *  Jquery 2
 *  socket.io
 * */

$(function () {
    'use strict';
    console.debug('GO DEBUG GO GO');
    var question_default = $('#question').html().trim();

    var stats = {};

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
        var $advice = $('div#advice'),
        content = $advice.html().trim(),
        result,
        // We can put  a datetime on it...
        $pushed_advice = $('<div class="tl_advice">');

        $pushed_advice.html(content);
        $('div#timeline').append($pushed_advice);

        // TODO : regarder comment recuperer tous les groupes (la on ne
        // recupere que l'index, c'est useless
        var result = content.search(/#(\S+)(\s|$)/);
        console.debug('Result : ' + result);
    });
});
