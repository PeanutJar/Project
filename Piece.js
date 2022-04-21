let Piece = function(id,xpos,ypos,radius,sAngle,eAngle,color,context) {
    this.id = id; //(example: "01") may need later later clarification with chess (maybe also if there are multiple piece types (like 2 kights))
    //this.name = name; //can use for chess but not checkers
    this.xpos = xpos
    this.ypos = ypos
    this.radius = radius
    this.sAngle = sAngle
    this.eAngle = eAngle
    this.color = color
    this.context = context //so we can actually draw stuff onto the canvas
    drawArc()
}

	function drawArc()
   	{
        this.context.save(); //save current state in stack
        this.context.setTransform(1,0,0,1,0,0);

        this.context.translate(this.xpos,this.ypos);
        this.context.fillStyle = this.color;
        this.context.arc(0,0,this.radius,this.sAngle,this.eAngle);
        this.context.fill()

        this.context.restore(); //pop old state on to screen
   	}


module.exports = Piece;