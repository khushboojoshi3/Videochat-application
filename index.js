const express = require("express");
const socket = require("socket.io"); 
const app = express();

let server = app.listen(process.env.PORT || 4000,function () {
    console.log("Server is running");
});

app.use(express.static("public")); 

let io = socket(server);

io.on("connection",function (socket) {

    socket.on("sendingMessage", function (data) {
        io.emit("broadcastMessage", data);
    });

    console.log("Websocket Connected", socket.id);
 });


io.on("connection",function (socket) {
      console.log("User Connected :"+ socket.id);

      socket.on("join", function (roomName) {
            // no of rooms in a server
            // console.log(io.sockets);
            let rooms = io.sockets.adapter.rooms; //rooms means client that are connected to a particular socket
            
            // console.log(rooms);
            //check if room with roomName exists of not
            let room = rooms.get(roomName);
            //if room is undefined that means no such room exists else we will get an object which contains how many people are there in that room 
            // console.log(room);
            if(room == undefined){
                socket.join(roomName);
                socket.emit("created");
            }

            else if(room.size==1){ //1 client in the room
                socket.join(roomName);
                socket.emit("joined");
            }

            else{
                socket.emit("full");
            }
            // console.log(rooms);
      });

      socket.on("ready", function (roomName) {
            // console.log("Ready");
            socket.broadcast.to(roomName).emit("ready"); //socket.broadcast.to().emit() will send data to all connected sockets except the one that originally emitted the event
      });

      socket.on("candidate", function (candidate, roomName) {
        // console.log(candidate);
        socket.broadcast.to(roomName).emit("candidate",candidate);
      });

      socket.on("offer", function (offer, roomName) {
        // console.log(offer);
        socket.broadcast.to(roomName).emit("offer",offer);
      });

      socket.on("answer", function (answer, roomName) {
        // console.log("Answer");
        socket.broadcast.to(roomName).emit("answer",answer);
      });

      socket.on("leave", function (roomName) {
        socket.leave(roomName);
        socket.broadcast.to(roomName).emit("leave");
      });
});
