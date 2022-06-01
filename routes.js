let express = require("express");
let router = express.Router();
var path = require("path");

const BD = require("./BoardRoom");
let doug = new BD()

const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getRoomNumUsers,
  getServerNumberUsers
} = require('./utils/users');


const botName = 'ChatCord Bot';

module.exports = function(io) {
let m = 0;
//let idnum = -1



// Run when client connects
io.on('connection', socket => {
  //idnum++
  //console.log("client id = " + idnum)



/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

let Person1Turn = true


let board = []
board.length = 8

let Pieces = []
Pieces.length = 24

for(let i = 0; i < board.length; i++)
{
  board[i] = new Array(8)
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
  socket.on('getGameRoomUsers', ({ username, room }) => {
      if(getRoomNumUsers(room) >= 2)
      {
        //userLeave(socket.id);
        socket.emit("joinRoom", {people:getRoomNumUsers(room)})
        return
      }
      socket.emit("joinRoom", {error:false})
  })


  socket.on('joinRoom', ({ username, room }) => {
    console.log("this room is " + room)
    //"socket.id" the identification each socket connection is given, so we
    //can use this to assign to a user
    let user
 
    if(getRoomNumUsers(room) >= 2) //no more than 2 people per room (still
      //the issue of person not updating id when join mid match)
    {
      socket.emit("joinRoom", {people:getRoomNumUsers(room)})
      return
    }
    else
    {
      user = userJoin(socket.id, username, room);
      let drakeo = doug.JoinBoard(user.room)
      let mokeny = doug.CreatBoard()
      board = mokeny.BoarD
      Pieces = mokeny.PiecE

      socket.join(user.room); 
    }

    io.to(user.room).emit("getroomUsers", getRoomNumUsers(user.room))

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
socket.emit('welcome', { identifier: 1 });
//////////////////////////////////////////////
    socket.on('posttest', function(req, res){
    console.log("test complete!");
    io.emit('posttest',{error:false})
    //res.json({error:false});
    });
//////////////////////////////////////////////
    socket.on("testnum",function(data) {
      console.log(data.number)
      io.emit('testnum',{error:false})
    })
//////////////////////////////////////////////
    socket.on('piecemove', function(data){

      let num1 = parseInt(data.COL)
      let num3 = parseInt(data.Colnew)
      let num4 = num1 + num3

      let num2 = parseInt(data.ROW)
      let num5 = parseInt(data.Rownew)
      let num6 = num2 + num5

      board[num4][num6].STAT = JSON.parse(data.IsHere)
      board[data.COL][data.ROW].STAT = null
      Pieces[data.index].COL = num4
      Pieces[data.index].ROW = num6

      Pieces[data.index].TYPE = data.type

      Person1Turn = !Person1Turn

      console.log("hi :)")
      console.log(Person1Turn)

    io.to(user.room).emit("piecemove",{PIECE:Pieces,BOARD:board,UMidk: "questionmark",TURN: Person1Turn})
      
    });

//////////////////////////////////////////////
    socket.on('pieceupdate', function(data){
      
      Pieces = data.PIECE
      board = data.BOARD

      socket.emit("pieceupdate",{error:false});
    })


//////////////////////////////////////////////
    socket.on('request', function(data){
      let object = JSON.parse(data.IsHere) 

      board[data.COL][data.ROW].STAT = object

      socket.emit("request",{PIECE:Pieces,BOARD:board,UMidk: "questionmark"});
    })

//////////////////////////////////////////////
    console.log("client room id = " + user.roomNum)
    socket.emit("getid",user.roomNum)
//////////////////////////////////////////////
    socket.on('getturn', function(){

      io.to(user.room).emit("getturn", Person1Turn)
    })
//////////////////////////////////////////////
     socket.on('updateturn', function(data){
      Person1Turn = data
      socket.emit("getturn",Person1Turn);
    })
//////////////////////////////////////////////
    socket.on('recieve', function(data){

      socket.emit('recieve',{PIECE:Pieces,BOARD:board});
    });
//////////////////////////////////////////////

    socket.on('piecedelete', function(data){
      board[data.CoL][data.ROW].STAT = null
      //if(Pieces[req.body.index].COL != null || Pieces[req.body.index].COL != undefined)
      {
        Pieces[data.index].COL = null
        Pieces[data.index].ROW = null
      }
        console.log("piece deleted")
        io.to(user.room).emit("piecedelete",{PIECE:Pieces,BOARD:board,UMidk: "questionmark"})
    });

/////////////////////////////////////////////////////////
    socket.on('mouseclick', function(data){
      m = parseInt(data.number) + 1
      console.log(m);
      //socket.emit('mouseclick',m)
    });
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////




/*
    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );
      

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
*/


  });

  // Listen for chatMessage
  /*
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });
  */

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);


    if (user) {

      /*
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );
      */

      // Send users and room info
      /*
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
      */
       io.to(user.room).emit('roomUsers2', getRoomNumUsers(user.room));

    }
  });
});

return router
}

//module.exports = router