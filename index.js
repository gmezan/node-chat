//imports
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

//configs
var app = express();
var server = http.Server(app);
var io = socketIO(server);

//server init
server.listen(80,function(){
    console.log("Servidor corriendo en el puerto 80");
});

//express routes
app.get('/',function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

//Socket io
io.on('connection', function (socket) {		
	console.log("Usuario Conectado");

	socket.on('disconnect', function(){
    	console.log('Usuario Desconectado');
  	});

	socket.on('chat message',function(msg){
  		console.log("Mensaje del cliente: " + msg);
  		io.emit('mensaje',msg);
	})

});



