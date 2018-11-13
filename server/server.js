const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

const pathPublic = path.join(__dirname, '../public');

io.on('connection', socket => {
  console.log('New user Connected');

  socket.emit(
    'newMessage',
    generateMessage('Admin', 'Welcome to the chat app')
  );

  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New user join')
  );

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', cords => {
    io.emit(
      'newLocationMessage',
      generateLocationMessage('Admin', cords.latitude, cords.longitude)
    );
  });

  socket.on('disconnect', () => {
    console.log('Disconnect from server');
  });
});

app.use(express.static(pathPublic));

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
