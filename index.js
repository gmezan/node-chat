//imports
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var connectedUsers = 0;
var users = {};
var counter = 0;

//configs
var app = express();
var server = http.Server(app);
var io = socketIO(server);

//server init
server.listen(80,function(){
    console.log("Server running on port: 80");
});

//express routes
app.get('/',function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

//Socket io
io.on('connection', function (socket) {		
	console.log("Connected user");
	connectedUsers++;
	counter++;
	console.log(counter);


	socket.on('username',function(username){
	  		users[socket.id] = username;
	  		console.log(users);
	  	});

	io.emit('connUsers', Math.floor((connectedUsers+1)/3));

	socket.on('disconnect', function(){
		connectedUsers--;
    	console.log('Disconnected user');
    	io.emit('connUsers', Math.floor((connectedUsers+1)/3));
  	});

	socket.on('chat message',function(msg){
  		console.log("Mensaje del cliente: " + msg);
  		io.emit('mensaje', {username: users[socket.id], msg: msg});
  		//socket.broadcast.emit('mensaje', {username: users[socket.id], msg: msg});
	})

	

});



