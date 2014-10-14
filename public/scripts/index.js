// This script goes along with the index page

$(function () {
    'use strict';
    var buttonClicked = false;
    $("#question_submit").click(function () {
        if (buttonClicked) {
            return;
        }
        console.debug("J'ai cliqué sur le bouton");
        $.ajax({
            type: 'POST',
            url: '/poll_submit',
            data: { 'question': $('#question').html().trim() }
        })
        .done(function (redirectionId) {
            if (redirectionId) {
                $('div#result')
            .append('<p>Your poll is created and can be accessed at this page:</p>')
            .append('<a href="/' + redirectionId +'">' + window.location.href + redirectionId + '</a>')
            .append('<p>You may send it to your recipient.</p>');
            }
        });
    });
});
