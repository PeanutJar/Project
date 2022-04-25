let express = require("express");
let bodyParser = require('body-parser');
let routes = require("./routes");
//let router = express.Router();
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/js', express.static('./public/js'));
app.use(express.static('./images'));
app.use(express.static('./public'));

app.use(routes);

var port = process.env.PORT || 3007;
app.listen(port);

/*
text_input.addEventListener("keypress",function(event) {
//if the key pressed is the enter key
if (event.code != "Enter")
{
return;
}
// will only get here when return key is pressed.
//handle to a newly created list item.
var list_item = document.createElement("li");
list_item.textContent = text_input.value;

//handle to the unordered list element.
var list = document.getElementById("playlist");
list.appendChild(list_item);
//this clears textInput (so what you types still sin't there when you press enter)
text_input.value = "";
});
*/