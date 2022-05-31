const users = [];
let numUsers = []

// Join user to chat
function userJoin(id, username, room) {

  let prop = ("" + room)

  if(numUsers[prop] == undefined || numUsers[prop] == null)
  {
    console.log("ebri")
    numUsers[prop] = 1
  }
  else if(numUsers[prop] != undefined || numUsers[prop] != null)
  {
    console.log("toejero")
    numUsers[prop] += 1
  }
  console.log(numUsers[prop])
  let roomNum

  if(numUsers[prop] == null || numUsers[prop] < 0)
  {
    roomNum = 0 //roomNum is the user's join order placement in the ROOM
  }
  else if(numUsers[prop] >= 0)
  {
    roomNum = (numUsers[prop] - 1)
  }
  


  const user = { id, username, room, roomNum };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {

  const index = users.findIndex(user => user.id === id);

  let userbd = users.find(user => user.id === id);
  if(userbd == undefined)
  {
    return
  } 
  let prop = ("" + userbd.room)
  console.log("there are " + numUsers[prop] + " in this room")
  if(numUsers[prop] - 1 >= 0)
  {
    numUsers[prop] -= 1
  }
  console.log("there are now " + numUsers[prop] + " in this room")
  //console.log(numUsers[prop])

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

function getRoomNumUsers(room) {
  let prop = ("" + room)
  console.log(prop + "======")
  return numUsers[prop];
}

function getServerNumberUsers() {
  console.log("users in server = " + users.length)
  return users.length;
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getRoomNumUsers,
  getServerNumberUsers
};
