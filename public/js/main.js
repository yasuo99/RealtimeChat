const chatForm = document.getElementById('chat-form')
const chatmessages = document.querySelector('.chat-messages');
const roomUsers = document.getElementById('users');
const socket = io();
//get params
const url = new URL(document.location.href);
const username = url.searchParams.get('username');
const roomname = url.searchParams.get('room');

//set roomname
document.getElementById('room-name').innerHTML = roomname;
socket.emit('joinRoom', joinRoom(username, roomname));
//message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scrolldown mesage
    chatmessages.scrollTop = chatmessages.scrollHeight;
})
socket.on('usersRoom', users => {
    const oldUsers = document.querySelectorAll(".roomuser");
    oldUsers.forEach((val) => {
        roomUsers.removeChild(val);
    })
    users.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('roomuser');
        li.innerHTML = `${item.username}`;
        roomUsers.appendChild(li);
    })
})
//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    //emit msg to server
    socket.emit('chatmsg', inputMessage(username, msg));
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//ouput message to dom
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.message}
     </p>`
    document.querySelector(".chat-messages").appendChild(div);
}
function inputMessage(username, msg) {
    return {
        username: username,
        msg: msg
    }
}
function joinRoom(username, room) {
    return {
        username,
        room
    }
}