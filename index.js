const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const io = new Server();
const app = express();

app.use(bodyParser.json());

const emailToSOcketMapping = new Map()

io.on("connection", (socket) => {
    socket.on('join-room', (data) => {
        const { roomId, emailId } = data;
        console.log('User', emailId, 'Koined Room', roomId)
        emailToSOcketMapping.set(emailId, socket.id)
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-joined", { emailId })
    })
})

app.listen(8000, () => console.log("Http Server running on port"));
io.listen(8001);
