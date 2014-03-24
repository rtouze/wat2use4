window.onload = function() {
    'use strict';
    var message = document.querySelector('#message'),
        socket = io.connect('http://localhost'),
        euse = document.querySelector('#euse'),
        toto = document.querySelector('#toto');

    socket.on('news', function (data) {
        message.textContent = data.hello;
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });

    socket.on('connard', function (data) {
        message.textContent += ' ' + data.message;
    });

    socket.on('responseFromClick', function (data) {
        toto.innerHTML += "Quelqu'un a cliqué<br />";
    });

    euse.onclick = function(event) {
        event.preventDefault();
        socket.emit('click', {});
        toto.innerHTML += "C'est moi qui ait cliqué...<br />"
    };
};
