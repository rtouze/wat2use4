// This script goes along with the index page

$(function () {
    'use strict';
    var buttonClicked = false,
        $question = $('#question'),
        $question_submit = $('#question_submit');

    $question.removeAttr('disabled');

    $question.on('focus', function (evt) {
        evt.target.value = null;
    });

    $question_submit.click(function () {
        if (buttonClicked) {
            return;
        }
        $.ajax({
            type: 'POST',
            url: '/poll_submit',
            data: { 'question': $question.val().trim() } })
        .done(function (redirectionId) {
            if (redirectionId) {
                var newUrl = window.location.href + redirectionId;
                $('div#result')
                    .append('<p>Your poll is created and can be accessed at this page:</p>')
                    .append('<a href="/' + redirectionId +'">' + newUrl + '</a>')
                    .append('<p>You may send it to your recipient.</p>');
                    buttonClicked = true;
                    $question.attr('disabled', 'disabled');
                    $question_submit.attr('disabled', 'disabled');
            }
        });
    });
});
