var io = require('socket.io').listen(80);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
      socket.emit('connard', { message: 'lolilol' });
  });
  socket.on('click', function (data) {
      console.log("j'ai recu un click");
      socket.broadcast.emit('responseFromClick', {});
  });
});
