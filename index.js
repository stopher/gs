const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const schedule = require('node-schedule');

var fs = require('fs');
var json = JSON.parse(fs.readFileSync('./currentState.json', 'utf8'));

const clients = [];
const currentState = json;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	clients.push(socket);
  	console.log('a user connected');
  	socket.broadcast.emit('new client connected');
  	socket.on('disconnect', function(){
    	console.log('client disconnected');
  	});
	  socket.on('chat message', function(msg){
	  	console.log('message: ' + msg);
	    io.emit('chat message', msg);
	  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});

const updateClients = schedule.scheduleJob('*/5 * * * * *', function(fireDate){
  console.log("Broadcasting currentState");
  io.emit('currentState message', json);
  /*clients.forEach(x => {

  });
  */
});