  //var socket = io()

  let numplayers
  socket.on('getroomUsers', (elem1) => {
    //alert(elem1 + " people in this room")
    numplayers = parseInt(elem1)
    const roomFill = document.getElementById('Misc');
    if(numplayers < 2)
    {
      console.log(roomFill.innerHTML)
      //alert("Game will start when at least 2 players are in the game room") //put this higher and just do alter then 'return'
    }
    else
    {
      roomFill.innerHTML = ""
      socket.emit('getturn');
    }
  });
      

window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded() {
   canvasApp();
}
  //"canvasApp" is the main function
function canvasApp(){


   var theCanvas = document.getElementById("canvas");
   //var thebutton = document.getElementById("leave-btn");
theCanvas.addEventListener("mousemove",onMouseMove,false);
theCanvas.addEventListener("click",onMouseClick,false);

 

   if (!theCanvas || !theCanvas.getContext) {
      return;
   }

   var context = theCanvas.getContext("2d");

   if (!context) {
      return;
   }
  
   //canvasApp level variables

   var rotation = 0.0;

   var keyPressList = [];
   var mouseX = 0;
   var mouseY = 0;
   var click = false;
   var pieceMove = false
   let UniversalPointer = null
   let Person1turn = true

   let firstTime

   let LocalBoardArray = []
   LocalBoardArray.length = 8

   for(let i = 0; i < LocalBoardArray.length; i++)
   {
    LocalBoardArray[i] = new Array(8)
   }

   let LocalPieceArray = []
   LocalPieceArray.length = 24

   let Indentification = 0


   gameLoop();

///////////////////////////////////////////////////////
   function gameLoop()
   {
        var FRAME_RATE = 40;
        var intervalTime = 1000/FRAME_RATE;

        if(numplayers >= 2)
        {
          input();
          paint();
          animate();
        }
        window.setTimeout(gameLoop, intervalTime);
   }
/*
   document.onkeydown = function(e){
      e = e?e:window.event;
      keyPressList[e.keyCode] = true;
   }

   document.onkeyup = function(e){
      e = e?e:window.event;
      keyPressList[e.keyCode] = false; //if key is no long being pressed, then it is set to false (won't do anything till pressed again)
   };
   */

///////////////////////////////////////////////////////
  socket.on('getturn', (elem1) => {
      Person1turn = elem1
      if(Person1turn)
      {
        if(Indentification == 0 && numplayers >= 2)
        {
          document.getElementById('Turn').innerHTML = "Your Turn"
        }
        else if(Indentification == 1 && numplayers >= 2)
        {
          document.getElementById('Turn').innerHTML = "Opponent's Turn"
        }
        document.getElementById('Misc').innerHTML = "Green goes! 1"
      }
      else if(!Person1turn)
      {
        if(Indentification == 1 && numplayers >= 2)
        {
          document.getElementById('Turn').innerHTML = "Your Turn"
        }
        else if(Indentification == 0 && numplayers >= 2)
        {
          document.getElementById('Turn').innerHTML = "Opponent's Turn"
        }
        document.getElementById('Misc').innerHTML = "White goes! 1"
      }
   });

  socket.on('getid', (elem1) => {
    let daNum = (elem1%2) //turns even numbers to 0 and odd numbers to 1
    Indentification = daNum

    if(Indentification == 0 && numplayers >= 2)
    {
      document.getElementById('Turn').innerHTML = "Your Turn"
    }
    else if(Indentification == 1 && numplayers >= 2)
    {
      document.getElementById('Turn').innerHTML = "Opponent's Turn"
    }
    //alert(Indentification + " is the id")
  });

  socket.on('piecemove', (elem1) => {

    if(Indentification == 0 && !Person1turn)
    {
      socket.emit('pieceupdate',(elem1));
    }
    else if(Indentification == 1 && Person1turn)
    {
      socket.emit('pieceupdate',(elem1));
    }

    Data(elem1)
  });

  socket.on('piecedelete', (elem1) => {

    if(Indentification == 0 && !Person1turn)
    {
      socket.emit('pieceupdate',(elem1));
    }
    else if(Indentification == 1 && Person1turn)
    {
      socket.emit('pieceupdate',(elem1));
    }

    Data(elem1)
  });

  socket.on('request', (elem1) => {
    Data(elem1)
  });

  socket.on('recieve', (elem1) => {
    Data(elem1)
  });

  socket.on('roomUsers2', (elem1) => {
    numplayers = elem1
});

///////////////////////////////////////////////////////

   function onMouseMove(e)
   {
        //mouseX = e.clientX - theCanvas.offsetLeft;
        //mouseY = e.clientY - theCanvas.offsetTop;
        mouseX = e.clientX;
        mouseY = e.clientY;
   }
   function onMouseClick(e)
   {

        //click = !click; //every other click, click is true
        click = true

        let xscale = innerWidth*.009
        let yscale = innerHeight*.009
        let scale = 0
        if(xscale >= yscale)
        {
          scale = yscale
        }
        else if(yscale > xscale)
        {
          scale = xscale
        }

        let pt = UniversalPointer

        for(let i = 0; i < LocalPieceArray.length; i++)
        {
          if(click && !pieceMove)
          { //piece hitbox
            if(mouseX < LocalPieceArray[i].XVALUE + ((scale*10)/2) && mouseX > LocalPieceArray[i].XVALUE - ((scale*10)/2) && mouseY < LocalPieceArray[i].YVALUE + ((scale*10)/2) && mouseY > LocalPieceArray[i].YVALUE - ((scale*10)/2))
            {
              UniversalPointer = LocalPieceArray[i]
              pieceMove = true  
              return
                   
            }
          }
          else if(click && pieceMove)
          {
            let xval = innerWidth * (1/3)
            let yval = innerHeight * (1/9)

            let xscale = innerWidth*.009
            let yscale = innerHeight*.009
            let scale = 0
            if(xscale >= yscale)
            {
              scale = yscale
            }
            else if(yscale > xscale)
            {
              scale = xscale
            }

            for(let b = -1; b < 2; b+=2)
            {
              for(let w = -1; w < 2; w+=2) //"w" is how a piece moves left and right ("b" is there so kings are able to move left, righta, up AND, down)
              {
                let upordown = -1
                if(pt.Type == "king")
                {
                  upordown = (w*b)
                }
                else if(pt.Color == '#00FF00')
                {
                  upordown = -1
                }
                else if(pt.Color == '#FFFFFF')
                {
                  upordown = 1
                }

                let placeX3 = (xval+((pt.Column + w)*(scale*10))) + ((scale*10)/2)
                let placeY3 = (yval+((pt.Row + upordown)*(scale*10))) + ((scale*10)/2)


                if(mouseX < placeX3 + (((scale*10)/2)) && mouseX > placeX3 - (((scale*10)/2)) && mouseY < placeY3 + (((scale*10)/2)) && mouseY > placeY3 - (((scale*10)/2)))
                {
                  {
                    if(LocalBoardArray[pt.Column + w][pt.Row + upordown].Status == null)
                    {
                      if(Indentification == 0 && Person1turn && pt.Color == '#00FF00' && pt.Type == "king")
                      {
                        pieceMove = false
                        UniversalPointer = null

                        pt.Column = (pt.Column + w)
                        pt.Row = (pt.Row + upordown) //this is just here so hurr can properly update
                        let hurr = JSON.stringify(pt)
                        pt.Column = (pt.Column - w)
                        pt.Row = (pt.Row - upordown)

                        socket.emit('piecemove',{IsHere: hurr, COL: pt.Column, ROW: pt.Row, Colnew : w, Rownew : upordown, index: pt.id, type: "king"});

                        return
                      }
                      else if(Indentification == 1 && !Person1turn && pt.Color == '#FFFFFF' && pt.Type == "king")
                      {
                        pieceMove = false
                        UniversalPointer = null

                        pt.Column = (pt.Column + w)
                        pt.Row = (pt.Row + upordown) //this is just here so hurr can properly update
                        let hurr = JSON.stringify(pt)
                        pt.Column = (pt.Column - w)
                        pt.Row = (pt.Row - upordown)

                        socket.emit('piecemove',{IsHere: hurr, COL: pt.Column, ROW: pt.Row, Colnew : w, Rownew : upordown, index: pt.id, type: "king"});


                        return
                      }
                      else if(Indentification == 0 && Person1turn && pt.Color == '#00FF00')
                      {
                        //alert(!Person1turn + " player's 2 turn is next")
                        pieceMove = false
                        UniversalPointer = null
                        let barcle = "normal"
                        if(pt.Row + upordown == 0)
                        {
                          barcle = "king"
                        }

                        pt.Column = (pt.Column + w)
                        pt.Row = (pt.Row + upordown) //this is just here so hurr can properly update
                        let hurr = JSON.stringify(pt)
                        pt.Column = (pt.Column - w)
                        pt.Row = (pt.Row - upordown)

                        socket.emit('piecemove',{IsHere: hurr, COL: pt.Column, ROW: pt.Row, Colnew : w, Rownew : upordown, index: pt.id, type: barcle});

                        return
                      }
                      else if(Indentification == 1 && !Person1turn && pt.Color == '#FFFFFF')
                      {
                        //alert(!Person1turn + " player's 1 turn is next")
                        pieceMove = false
                        UniversalPointer = null
                        let barcle = "normal"
                        if(pt.Row + upordown == 7)
                        {
                          barcle = "king"
                        }

                        pt.Column = (pt.Column + w)
                        pt.Row = (pt.Row + upordown) //this is just here so hurr can properly update
                        let hurr = JSON.stringify(pt)
                        pt.Column = (pt.Column - w)
                        pt.Row = (pt.Row - upordown)

                        socket.emit('piecemove',{IsHere: hurr, COL: pt.Column, ROW: pt.Row, Colnew : w, Rownew : upordown, index: pt.id, type: barcle});

                        return
                      }
                    }
                    else if(LocalBoardArray[pt.Column + w][pt.Row + upordown].Status != null)
                    {
                      if(Indentification == 0 && Person1turn && pt.Color == '#00FF00')
                      {
                        let num1 = parseInt(pt.Column + w)
                        let num2 = parseInt(pt.Row + upordown)

                        let num3 = num1 + w
                        let num4 = num2 + upordown

                        if(LocalBoardArray[num1][num2].Status.Color == '#FFFFFF')
                        {
                          let gary = LocalBoardArray[num1][num2] //board square being jumped over

                          pt.Column = (pt.Column + w)
                          pt.Row = (pt.Row + upordown) //this is just here so hurr can properly update
                          let hurr = JSON.stringify(pt)
                          pt.Column = (pt.Column - w)
                          pt.Row = (pt.Row - upordown)

                          if(num2 == 0 || num2 == 7 || LocalBoardArray[num3][num4].Status == null)
                          {
                            pieceMove = false
                            UniversalPointer = null

                            socket.emit('piecedelete',{IsHere: gary, CoL: num1, ROW: num2, index: gary.Status.id});


                            if(num4 == 0 || num2 == 0 || num2 == 7 || pt.Type == "king")
                            {
                              let number = 2
                              if(num2 == 0 || num2 == 7) //so it doesn't jump past the board
                              {
                                number = 1
                              }
                                socket.emit('piecemove',{IsHere: hurr, COL: pt.Column, ROW: pt.Row, Colnew : w*number, Rownew : upordown*number, index: pt.id, type: "king"});

                            }
                            else
                            {
                              socket.emit('piecemove',{IsHere: hurr, COL: pt.Column, ROW: pt.Row, Colnew : w*2, Rownew : upordown*2, index: pt.id, type: "normal"});

                            }

                            return false
                          }
                        }
                      }
                      else if(Indentification == 1 && !Person1turn && pt.Color == '#FFFFFF')
                      {
                        let num1 = parseInt(pt.Column + w)
                        let num2 = parseInt(pt.Row + upordown)

                        let num3 = num1 + w
                        let num4 = num2 + upordown

                        if(LocalBoardArray[num1][num2].Status.Color == '#00FF00')
                        {
                          let gary = LocalBoardArray[num1][num2]

                          pt.Column = (pt.Column + w)
                          pt.Row = (pt.Row + upordown) //this is just here so hurr can properly update
                          let hurr = JSON.stringify(pt)
                          pt.Column = (pt.Column - w)
                          pt.Row = (pt.Row - upordown)

                          if(num2 == 7 || num2 == 0 || LocalBoardArray[num3][num4].Status == null)
                          {
                            pieceMove = false
                            UniversalPointer = null

                            socket.emit('piecedelete',{IsHere: gary, CoL: num1, ROW: num2, index: gary.Status.id});


                            if(num4 == 7 || num2 == 0 || num2 == 7 || pt.Type == "king")
                            {
                              if(num2 == 0 || num2 == 7)
                              {
                                number = 1
                              }
                              socket.emit('piecemove',{IsHere: hurr, COL: pt.Column, ROW: pt.Row, Colnew : w*number, Rownew : upordown*number, index: pt.id, type: "king"});

                            }
                            else
                            {
                              socket.emit('piecemove',{IsHere: hurr, COL: pt.Column, ROW: pt.Row, Colnew : w*2, Rownew : upordown*2, index: pt.id, type: "normal"});

                            }

                            return false
                          }
                        }
                      }
                    }
                  }

                }
              }
            }
          }
        }
        UniversalPointer = null //so this does not point to the same piece
        pieceMove = false //so person cannot keep clicking and moving their piece


   }
   function input()
   {
       if (keyPressList[38]==true){
       //Up arrow
       }

       if (keyPressList[37]==true) {
       //Left arrow
       }

       if (keyPressList[39]==true) {
       //Right arrow
       }
   }

   function Data(info) {
    
     if(info != null && info.TURN != null)
     {
      //this prints for the client when the client does stuff (for that person who did something)
      Person1turn = info.TURN
      socket.emit('updateturn',(Person1turn))
     } 


      let xval = innerWidth * (1/3)
      let yval = innerHeight * (1/9)

      let xscale = innerWidth*.009
      let yscale = innerHeight*.009
      let scale = 0
      if(xscale >= yscale)
      {
        scale = yscale
      }
      else if(yscale > xscale)
      {
        scale = xscale
      }

      for(let i = 0; i < LocalBoardArray.length; i++)
      {

        for(let j = 0; j < LocalBoardArray[i].length; j++)
        {        
          let placeX = xval+(i*(scale*10))
          let placeY = yval+(j*(scale*10))

          if(info != undefined && info != null)
          {
            LocalBoardArray[i][j] = {XVALUE:placeX,YVALUE:placeY,ROTATION:rotation,SCALE:scale,Column:info.BOARD[i][j].COL,Row:info.BOARD[i][j].ROW,Color:info.BOARD[i][j].COLOR,Status:info.BOARD[i][j].STAT}

         }
         else if(info == null) //here so we don't reset variables when re-initializing (reasoning behind it below)
         {
           let pt = LocalBoardArray[i][j]
           LocalBoardArray[i][j] = {XVALUE:placeX,YVALUE:placeY,ROTATION:rotation,SCALE:scale,Column:pt.Column,Row:pt.Row,Color:pt.Color,Status:pt.Status}
         }
        }
      }
    for(let i = 0; i < LocalPieceArray.length; i++)
    {

      if(info != undefined && info != null) 
      {

        let placeX3
        let placeY3

        if(info.PIECE[i].COL == null || info.PIECE[i].COL == undefined)
        {
          placeX3 = 100
        }
        else
        {
           placeX3 = (xval+((info.PIECE[i].COL)*(scale*10))) + ((scale*10)/2)
        }
        if(info.PIECE[i].ROW == null || info.PIECE[i].ROW == undefined)
        {
          placeY3 = 100
        }
        else
        {
           placeY3 = (yval+((info.PIECE[i].ROW)*(scale*10))) + ((scale*10)/2)
        }

        let image = document.createElement("img")
        image.src = info.PIECE[i].IMAGE

        LocalPieceArray[i] = {XVALUE: placeX3, YVALUE: placeY3, SCALE: (scale*4), Column: info.PIECE[i].COL, Row: info.PIECE[i].ROW, sANGLE: (0*Math.PI), eANGLE: (2*Math.PI),id: info.PIECE[i].INDEX, Color: info.PIECE[i].COLOR, IMG: image, Type: info.PIECE[i].TYPE}

        if(info.UMidk == undefined || info.UMidk != "questionmark")
        {

          //by default all areas of the board have an empty status, so this code here (once the pieces are all displayed) updates the board, so the indexes of the board (with pieces on them) will not have an empty status (this is *only* done here so we don't have to manually set certain board indexes to not be empty)
          let hurr = JSON.stringify(LocalPieceArray[i])

          socket.emit('request',{IsHere: hurr, COL: info.PIECE[i].COL, ROW: info.PIECE[i].ROW});

        }
      }
      else if(info == null) //this is really only here when we resize the window and also need to resize displays but don't wnat to change actual information
      {
        let pt = LocalPieceArray[i]

        let placeX3 = (xval+((pt.Column)*(scale*10))) + ((scale*10)/2)
        let placeY3 = (yval+((pt.Row)*(scale*10))) + ((scale*10)/2)

        LocalPieceArray[i] = {XVALUE: placeX3, YVALUE: placeY3, SCALE: (scale*4), Column: pt.Column, Row: pt.Row, sANGLE: (0*Math.PI), eANGLE: (2*Math.PI),id: pt.id, Color: pt.Color, IMG: pt.IMG, Type: pt.Type}
      }
     
    }

   }

   function paint()
   {

   if(firstTime == undefined) {
        //first time code goes here
        firstTime = "TurkeyTime"; //do the initialization
        socket.emit('recieve');

        return false
    }

   // draw background
   context.fillStyle = '#808080';
   //context.fillRect(xval, yval, 480, 480);
   context.fillRect(0, 0, innerWidth, innerHeight);




   //Text output
   /*
   context.fillStyle = '#ffffff';
   context.font = '10px sans-serif';
   context.textBaseline = 'top';
   if (click)
       context.fillText  ("click", 0, 180);
   else
       context.fillText  ("" + mouseX + " " + mouseY, 0, 180);
   */

  for(let i = 0; i < 8; i++) //draws the board
  {
    for(let j = 0; j < 8; j++)
    {
      if(LocalBoardArray[i][j] == undefined)
      {
        //alert("LocalBoardArray index" + i + " === " + j +  " is undefined!")
        return false
      }
     
      let my = LocalBoardArray[i][j]

      if(i % 2 == 0)
      {
        if(j % 2 == 0)
        {
          drawRect(my.XVALUE,my.YVALUE,my.ROTATION,my.SCALE,my.SCALE,my.Color);
        }
        else if(j % 2 == 1)
        {        
          drawRect(my.XVALUE,my.YVALUE,my.ROTATION,my.SCALE,my.SCALE,my.Color);
       }      
      }
      else if(i % 2 == 1)
      {
        if(j % 2 == 1)
        {
          drawRect(my.XVALUE,my.YVALUE,my.ROTATION,my.SCALE,my.SCALE,my.Color);
        }
        else if(j % 2 == 0)
        {
          drawRect(my.XVALUE,my.YVALUE,my.ROTATION,my.SCALE,my.SCALE,my.Color);
        }
      }
    }  
  }

  for(let ate = 0; ate < LocalPieceArray.length; ate++) //draws the pieces
  {
      if(LocalPieceArray[ate] == undefined)
      {
        //alert("LocalPieceArray index " + ate + " is undefined!")
        return false
      }

      let baby = LocalPieceArray[ate]
      if(baby.Column != null && baby.Row != null)
      {
        drawArc(baby.XVALUE,baby.YVALUE,baby.SCALE,baby.sANGLE,baby.eANGLE,baby.Color)

        if(baby.Type == "king")
        {
          drawArc(baby.XVALUE,baby.YVALUE,baby.SCALE/2,baby.sANGLE,baby.eANGLE,"#FFFF00")
        }
      }
         
  }
   
    window.onresize = function() {      
        //Setting the current height & width
        //to the elements    
        if(firstTime != undefined)
        {    
          $("#canvas").attr("width","" + innerWidth)
          $("#canvas").attr("height","" + innerHeight)
          paint();
          Data(null)
        }
        return false
    };

   return false;

   }

   function drawRect(xpos,ypos,rot,xscale,yscale,color)
   {
        context.save(); //save current state in stack
        context.setTransform(1,0,0,1,0,0);

        context.translate(xpos,ypos);
        context.rotate(rot);
        context.scale(xscale,yscale);
        context.fillStyle = color;
        context.beginPath();
        context.fillRect(0,0,10,10);

        context.restore(); //pop old state on to screen
   }

   function drawArc(xpos,ypos,radius,sAngle,eAngle,color)
   {
      this.xpos = xpos
      this.ypos = ypos
      this.radius = radius
      this.sAngle = sAngle
      this.eAngle = eAngle
      this.color = color
        context.save(); //save current state in stack
        context.setTransform(1,0,0,1,0,0);

        context.translate(xpos,ypos);
        context.fillStyle = color;
        context.beginPath();
        context.arc(0,0,radius,sAngle,eAngle);
        context.fill()

        context.restore(); //pop old state on to screen
   }

   function animate()
   {
       
   
   }


}