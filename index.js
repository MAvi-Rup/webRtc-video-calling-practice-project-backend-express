const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const io = new Server({
    cors: true,
});
const app = express();

app.use(bodyParser.json());

const emailToSOcketMapping = new Map()
const socketToEmailMapping = new Map()
io.on("connection", (socket) => {
    console.log("New Connection");
    socket.on('join-room', (data) => {
        const { roomId, emailId } = data;
        console.log('User', emailId, 'Koined Room', roomId)
        emailToSOcketMapping.set(emailId, socket.id)
        socketToEmailMapping.set(socket.id, emailId)
        socket.join(roomId);
        socket.emit('joined-room', { roomId })
        socket.broadcast.to(roomId).emit("user-joined", { emailId })
    })
    socket.on("call-user", (data) => {
        const { emailId, offer } = data;
        const fromEmail = socketToEmailMapping.get(socket.id)
        const socketId = emailToSOcketMapping.get(emailId)
        socket.to(socketId).emit('incoming-call', {
            from: fromEmail, offer

        })
    })

    socket.on('call-accepted', (data) => {
        const { emailId, ans } = data
        const socketId = emailToSOcketMapping.get(emailId)
        socket.to(socketId).emit("call-accepted", { ans })

    })
})

app.listen(8000, () => console.log("Http Server running on port"));
io.listen(8001);
