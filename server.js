var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var port = process.env.PORT || 8080;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/app/'));


app.get('/', function(req, res) {
  res.sendFile('index.html');
});


app.listen(port, function() {
  console.log('server started on port' + port);
});