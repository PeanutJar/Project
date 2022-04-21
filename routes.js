let path = require("path");
let express = require("express");
const myDatabase = require('./DataBase');
let db = new myDatabase()
const Piece = require('./Piece');

var app = express();

let router = express.Router();

router.get("/",function(req,res){
    res.sendFile(path.resolve(__dirname + "/public/views/index.html"));  //changed
});

const board = []
board.length = 8

const Pieces = []
Pieces.length = 24
let dingo = 0

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



module.exports = router;