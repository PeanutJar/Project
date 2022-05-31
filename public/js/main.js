var socket = io()

const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(location.search)
console.log(room + " eeeeeeee") //prints in browser console (developer tools)

// Join chatroom
socket.emit('getGameRoomUsers', { username, room });


socket.on('joinRoom', (elem1) => {
  if(elem1.people >= 2)
  {
    confirm("Cannot join. Room is full. Please Try Again Later")
    window.location = '../index.html';
  }
  else
  {
    socket.emit('joinRoom', { username, room });
  }

});

// Message from server

socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}


// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}


//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  //"confirm" is pretty much the same thing as an alert
  console.log("yeah?")
  const leaveRoom = confirm('You are about to leave the gameroom');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
