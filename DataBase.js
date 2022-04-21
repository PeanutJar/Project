const Piece = require('./Piece');


let DataBase = function(id,name,grade,doesdrive,color,rating) {
    this.id = id;
    this.name = name;
    this.grade = grade
    this.doesDrive = doesdrive
    this.color = color
    this.rating = rating
}


module.exports = DataBase;