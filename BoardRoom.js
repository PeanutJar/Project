var express = require("express");

const Rooms = []

function BoardRoom() {
this.board = []
this.board.length = 8

this.Pieces = []
this.Pieces.length = 24

}

BoardRoom.prototype.JoinBoard = function(room) {
  this.Room = room

  let whiskey = true
  for(let g = 0; g < Rooms.length; g++)
  {
    if(Rooms[g] == room)
    {
      whiskey = false
    }
  }

  if(whiskey)
  {
    Rooms.push(room) //in reality, this doesn't actually affect the board right now
  }
  return
}

BoardRoom.prototype.CreatBoard = function() {
/* just use something like this (needs a database)
  myDatabase.prototype.putData = function(data,res) {
  let obj = {ident:data.ident,name:data.name};  
  DataModel.findOneAndUpdate({ident:data.ident},{name:data.name},function(error,oldData) {
    if (error) {
      return res.json({error:true});
    }
    else if (oldData == null) {
      return res.json({error:true});
    }
    return res.json({error:false});
  });
}
*/

  let dingo = 0

  for(let i = 0; i < this.board.length; i++) // error on "this.board.length" (maybe remove 'this')
  {
    this.board[i] = new Array(8)
  }

  for(let i = 0; i < this.board.length; i++)
  {

    for(let j = 0; j < this.board[i].length; j++)
    {
    if(i % 2 == 0)
    {
      if(j % 2 == 0)
      {
        this.board[i][j] = {COL : i, ROW : j, COLOR : '#000000', STAT: null}
        if(j == 0 || j == 2)
        {
          this.Pieces[dingo] = {COL: i, ROW: j , INDEX: dingo, COLOR : '#FFFFFF', IMAGE: "", TYPE : "normal"}
          dingo++
        }
        else if(j == 6)
        {
          this.Pieces[dingo] = {COL: i, ROW: j, INDEX: dingo, COLOR : '#00FF00', IMAGE: "", TYPE : "normal"}
          dingo++
        }
      }
      else if(j % 2 == 1)
      {
        this.board[i][j] = {COL : i, ROW : j, COLOR : '#ff0000', STAT: null}
      }
    }
    else if(i % 2 == 1)
    {
      if(j % 2 == 0)
      {
        this.board[i][j] = {COL : i, ROW : j, COLOR : '#ff0000', STAT: null}
      }
      else if(j % 2 == 1)
      {
        this.board[i][j] = {COL : i, ROW : j, COLOR : '#000000', STAT: null}
        if(j == 1)
        {
          this.Pieces[dingo] = {COL: i, ROW: j, INDEX: dingo, COLOR : '#FFFFFF', IMAGE: "", TYPE : "normal"}
          dingo++
        }
        else if(j == 5 || j == 7)
        {
          this.Pieces[dingo] = {COL: i, ROW: j, INDEX: dingo, COLOR : '#00FF00', IMAGE: "", TYPE : "normal"}
          dingo++
        }
      }
    }
    }

  }

  return({BoarD: this.board, PiecE: this.Pieces})

}

module.exports = BoardRoom;