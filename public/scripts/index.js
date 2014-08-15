// This script goes along with the index page

window.onload = function () {
    'use strict';
    var   button = document.querySelector("div#question_submit");
    var buttonClicked = false;
    button.onclick = function () {
        if (buttonClicked) {
            console.debug("bouton deja cliqué, c'est mort");
            return;
        }

        console.debug("J'ai cliqué sur le bouton");
        var xhr = new XMLHttpRequest();
        var data = {
            'question': document.querySelector('div#question').textContent.trim()
        };

        xhr.open('POST', '/poll_submit', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader("Content-length", data.length);
        console.debug('XHR OK');

        xhr.send(JSON.stringify(data));

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    buttonClicked = true;
                    var redirectionId = xhr.responseText;
                    console.debug('redirectionId recupere');
                    if (redirectionId) {
                        var result = document.querySelector('div#result');
                        result.innerHTML = '<p>Click here :</p><a href="/' + redirectionId +'">' + 
                            window.location.href + redirectionId + '</a>';
                    }
                } else {
                    console.error('sth went wrong in XHR');
                }
            }
        };

    };
};
