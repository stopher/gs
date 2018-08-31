const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const schedule = require('node-schedule');

const fs = require('fs');
const json = JSON.parse(fs.readFileSync('./currentState.json', 'utf8'));

const clients = [];
const currentState = json;
const port = process.env.PORT || 8080;        // set our port

app.get('/', function(req, res){
  res.sendFile(__dirname + '/build/index.html');
});

app.use(express.static('build/static'))

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

http.listen(port, function(){
  console.log('listening on *:'+port);
});

const updateClients = schedule.scheduleJob('*/5 * * * * *', function(fireDate){
  console.log("Broadcasting currentState");
  io.emit('currentState message', json);
});