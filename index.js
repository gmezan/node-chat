//imports
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require("mysql2");
const defaultDB = { host: "database-3.csclycyj6wox.us-east-1.rds.amazonaws.com",
                    user: "administrador",
                    password: "administrador", //administrador123
                    port: 3306,
                    database: "node_chat"
                  };

//configs
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var conn = mysql.createConnection(defaultDB);

var n_users = 0;
var users = {};

//Querys:
const sqlInsert = "insert into chat (user,msg,datetime) values(?,?,now())";
const sqlInit = "select * from chat where datetime >= date_sub(now(), interval 5 minute)";
//server init
server.listen(80, function() {
    console.log("Server running on port 80");
});

//express routes
app.get('/', function(req,res){
  res.sendFile(__dirname + "/index.html");
});

//Socket io
io.on('connection', function(socket){
  console.log("Connected user");
  n_users++;
  io.emit('nUsers',n_users);
  conn.query(sqlInit, function(err, result) {
    if(err){
      console.log("There was an error: " + err);
    }
    io.to(socket.id).emit('init',result);
  });

  socket.on("disconnect",function(){
    n_users--;
    delete users[socket.id];
    io.emit('nUsers',n_users);
    io.emit('lUsers',users);
    console.log("Disconnected user");
  });

  socket.on('chat message',function(msg){
  		console.log("Mensaje del cliente: " + msg);
      socket.broadcast.emit('message_',{username: users[socket.id], msg: msg});
      conn.query(sqlInsert,[users[socket.id],msg], function(err, result) {
        if(err){
          console.log("There was an error: " + err);
        }
    });
  });

  socket.on('username',function(username){
      users[socket.id]=username;
      io.emit('lUsers',users);
      console.log(users);
  });

  socket.on('typing',function(){
    socket.broadcast.emit('user_typing',users[socket.id]+" is typing ...")
  })

})
