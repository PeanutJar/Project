let path = require("path");
let express = require("express");
const myDatabase = require('./DataBase');
let db = new myDatabase()
const Piece = require('./Piece');

var app = express();

let router = express.Router();

//var http = require("http").Server(app)
//var io require("socket.io")(http)

router.get("/",function(req,res){
    res.sendFile(path.resolve(__dirname + "/public/views/index.html"));  //changed
});

const board = []
board.length = 8

const Pieces = []
Pieces.length = 24
let dingo = 0

let Person1Turn = true

//const LoserPieces = []
//LoserPieces.length = 24

for(let i = 0; i < board.length; i++)
{
board[i] = new Array(8)
}

for(let i = 0; i < board.length; i++)
{

for(let j = 0; j < board[i].length; j++)
{
if(i % 2 == 0)
{
if(j % 2 == 0)
{
board[i][j] = {COL : i, ROW : j, COLOR : '#000000', STAT: null}
if(j == 0 || j == 2)
{
Pieces[dingo] = {COL: i, ROW: j , INDEX: dingo, COLOR : '#FFFFFF', IMAGE: "wario.png", TYPE : "normal"}
dingo++
}
else if(j == 6)
{
Pieces[dingo] = {COL: i, ROW: j, INDEX: dingo, COLOR : '#00FF00', IMAGE: "wario.png", TYPE : "normal"}
dingo++
}
}
else if(j % 2 == 1)
{
board[i][j] = {COL : i, ROW : j, COLOR : '#ff0000', STAT: null}
}
}
else if(i % 2 == 1)
{
if(j % 2 == 0)
{
board[i][j] = {COL : i, ROW : j, COLOR : '#ff0000', STAT: null}
}
else if(j % 2 == 1)
{
board[i][j] = {COL : i, ROW : j, COLOR : '#000000', STAT: null}
if(j == 1)
{
Pieces[dingo] = {COL: i, ROW: j, INDEX: dingo, COLOR : '#FFFFFF', IMAGE: "wario.png", TYPE : "normal"}
dingo++
}
else if(j == 5 || j == 7)
{
Pieces[dingo] = {COL: i, ROW: j, INDEX: dingo, COLOR : '#00FF00', IMAGE: "wario.png", TYPE : "normal"}
dingo++
//*NOTE* I've already mentioned this in the html, but you can just put different images for the diffent color pieces
//but there is really no point to having images at this current moment i realized, since we would need chess for that, but we
//should really finish checkers first (to be honest you can comment out the draw command
//in the html and the code should still work fine -- or just put "" for IMAGE)
}
}
}
}

}


//console.log(Pieces)

/*
const arr = [1, 2, 3, 4, 5, 6, 9, 7, 8, 9, 10];
arr.reverse();
const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
*/
//console.log(board)
//console.log(Pieces)

router.get('/recieve', function(req, res){
//console.log(board)
  res.json({PIECE:Pieces,BOARD:board});
});

router.post('/request', function(req, res){
let object = JSON.parse(req.body.IsHere) //need to parse, or else just reads
//as 'object' , which cannot actually be read ("undefined")

board[req.body.COL][req.body.ROW].STAT = object
//console.log(board[req.body.COL][req.body.ROW].STAT.Color)

 
  //console.log(req.body.ARRAY)
  //console.log(req.body.ARRAY[0][3].ROW)
  //console.log(board)
  res.json({PIECE:Pieces,BOARD:board,UMidk: "questionmark"});
});

router.post('/update', function(req, res){
let num1 = parseInt(req.body.COL.trim())
let num3 = parseInt(req.body.Colnew.trim())
let num4 = num1 + num3
//console.log(num1)


//console.log(req.body.Rownew + " = Rownew")
let num2 = parseInt(req.body.ROW.trim())
let num5 = parseInt(req.body.Rownew.trim())
let num6 = num2 + num5
//console.log(num2)

board[num4][num6].STAT = JSON.parse(req.body.IsHere)
board[req.body.COL][req.body.ROW].STAT = null
Pieces[req.body.index].COL = num4
Pieces[req.body.index].ROW = num6
//console.log(req.body.xVAL)
//console.log(req.body.type.trim())
//console.log(Pieces[req.body.index].TYPE)
Pieces[req.body.index].TYPE = req.body.type.trim()
 
  //console.log(req.body.ARRAY)
  //console.log(req.body.ARRAY[0][3].ROW)
  //console.log(board)
  //console.log(Pieces)
  res.json({PIECE:Pieces,BOARD:board,UMidk: "questionmark"});
});

router.post('/outofbounds', function(req, res){
board[req.body.CoL][req.body.ROW].STAT = null
//console.log(req.body.index)
//if(Pieces[req.body.index].COL != null || Pieces[req.body.index].COL != undefined)
{
Pieces[req.body.index].COL = null
Pieces[req.body.index].ROW = null
}
//console.log(req.body.xVAL)
 
  //console.log(req.body.ARRAY)
  //console.log(req.body.ARRAY[0][3].ROW)
  //console.log(board)
  //console.log(Pieces)
  res.json({PIECE:Pieces,BOARD:board,UMidk: "questionmark"});
});


module.exports = function(io) {
    // define routes
    // io is available in this scope
    router.get("io")

let m = 0;
let idnum = -1


    io.on('connection', function(socket) {
      //console.log(socket.id)
      idnum++
      console.log("client id = " + idnum)

    // Use socket to communicate with this particular client only, sending it it's own id
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
      //now it updates for the other people, not not the person sent
      io.emit("piecemove",{PIECE:Pieces,BOARD:board,UMidk: "questionmark",TURN: Person1Turn})
      //console.log("naaaah")
    });

    //io.emit("piecemove",{PIECE:Pieces,BOARD:board,UMidk: "questionmark",TURN: Person1Turn})
//////////////////////////////////////////////
    socket.on('request', function(data){
      let object = JSON.parse(data.IsHere) 

      board[data.COL][data.ROW].STAT = object

      io.emit("request",{PIECE:Pieces,BOARD:board,UMidk: "questionmark"});
    })

    //io.emit("request",{PIECE:Pieces,BOARD:board,UMidk: "questionmark"});
//////////////////////////////////////////////
    socket.emit("getid",idnum)
//////////////////////////////////////////////

    socket.on('getturn', function(data){
      console.log("getturn is " + Person1Turn)
      io.emit('getturn',Person1Turn);
    });
    

    //io.emit("getturn", Person1Turn)

/*
    socket.on("getturn",(callback) => {
      callback({
        status: Person1Turn
      })
    })
    */
//////////////////////////////////////////////
    socket.on('recieve', function(data){

      io.emit('recieve',{PIECE:Pieces,BOARD:board});
    });

    //io.emit('recieve',{PIECE:Pieces,BOARD:board});
//////////////////////////////////////////////

    socket.on('piecedelete', function(data){
      board[data.CoL][data.ROW].STAT = null
      //console.log(req.body.index)
      //if(Pieces[req.body.index].COL != null || Pieces[req.body.index].COL != undefined)
      {
        Pieces[data.index].COL = null
        Pieces[data.index].ROW = null
      }
        console.log("hello")
        //console.log(Pieces)
        io.emit('piecedelete',{error:false});
    });

    //io.emit("piecedelete",{PIECE:Pieces,BOARD:board,UMidk: "questionmark"})

/////////////////////////////////////////////////////////
    socket.on('mouseclick', function(data){
      m = parseInt(data.number) + 1
      console.log(m);
      //socket.emit('mouseclick',m)
    });
   
   /*
   socket.on("greetings2",function(data) {
    console.log("hello there")
      socket.emit('greetings2', 'Hey!')
    })
    */

   //socket.emit('greetings2', 'Hey!');

});


    return router;
}




//module.exports = router;