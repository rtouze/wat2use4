/* Javascript for w2u4 client side. 
 * Dependances :
 *  Jquery 2
 *  socket.io
 * */


$(function () {
    'use strict';
    console.debug('GO DEBUG GO GO');

    $('#question').click(function() {
        $(this).addClass('edit_mode');
    });

    $('#question_submit').click(function () {
        // TODO : remove css class edit_mode
        $('#question').attr('contenteditable', 'false').addClass('posted');
        $(this).hide();
        $('#advice_placeholder').show();
    });

    $('button#advice_submit').click(function () {
        var content = $(this).html();
    });

});
