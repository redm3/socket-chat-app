const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    console.log('a user connected');

    io.emit('user connected', 'A user has connected.');

    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('user disconnected', 'A user has disconnected.');
    });

    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    });

    socket.on('chat message', (data) => {
        socket.broadcast.emit('chat message', { nickname: data.nickname, message: data.message });
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});