const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessages = require('./untils/messages')
const { userJoin, getCurrentUser, removeUser, getAllUsersOfRoom } = require('./untils/users')

const app = express();
const server = http.createServer(app);

const io = socketio(server);
//set Static folder
app.use(express.static(path.join(__dirname, 'public')));
console.log(__dirname);
//run when client connects
io.on('connection', socket => {
    //join chat room
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room)
        //welcome current user
        socket.emit('message', formatMessages('Bot', 'welcome to chatroom'));
        io.to(room).emit('usersRoom', getAllUsersOfRoom(room));
        //inform other users
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessages(username, `${username} has joined the room`));
    })


    // second way :io.emmit(); to send to all general
    //run when a user disconnects
    socket.on('disconnect', () => {
        const user = getCurrentUser(socket.id);
        if (user) {
            removeUser(socket.id);
            io.to(user.room).emit('usersRoom', getAllUsersOfRoom(user.room));
            io.to(user.room).emit('message', formatMessages('Bot', `${user.username} has left the chat`));
        }
        else{
            io.emit('message', formatMessages('Bot', `Some one has left the chat`));

        }
    })
    //listen for chatmessages
    socket.on('chatmsg', ({ msg }) => {
        const user = getCurrentUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessages(`${user.username}`, msg));
        }
    })
})
const PORT = 5500 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));