let socket = io();
let VideoChatLobby = document.getElementById("video-chat-lobby");
let TextChatLobby = document.getElementById("chat-app");
let VideoChat = document.getElementById("video-chat-room");
let joinButton = document.getElementById("join");
let userVideo = document.getElementById("user-video");
let peerVideo = document.getElementById("peer-video");
let roomInput = document.getElementById("roomName");
let afterEnteringRoom = document.getElementById("after-entering-room");
let creator = false;
let rtcPeerConnection;
let userStream;


var message = document.getElementById("message");
var sendMessageButton = document.getElementById("send");
var username = document.getElementById("username");
var output = document.getElementById("output");

sendMessageButton.addEventListener("click", function () {
    socket.emit("sendingMessage", { //name of event is sending message
       message: message.value,
       username: username.value
    });
    message.value="";
 });

socket.on("broadcastMessage", function (data) {
    output.innerHTML +=
    "<p><strong>" + data.username +": </strong>" + data.message + "</p>";
});

let ButtonGroup = document.getElementById("btn-group");
let muteButton = document.getElementById("muteButton");
let hideCameraButton = document.getElementById("hideCameraButton");
let leaveRoomButton = document.getElementById("leaveRoomButton");


let muteFlag = false;
let hideCameraFlag = false;


// Contains the stun server URL we will be using.
let iceServers = {
   iceServers: [
     { urls: "stun:stun.services.mozilla.com" },
     { urls: "stun:stun.l.google.com:19302" },
     { urls: "stun:stun2.l.google.com:19302" },
     { urls: "stun:stun3.l.google.com:19302" },
     { urls: "stun:stun4.l.google.com:19302" },
   ],
 };

joinButton.addEventListener("click",function () {
   if(roomInput.value === ""){
       alert("Please enter a room name");
   }
   else{  
   roomName = roomInput.value; 
   socket.emit("join",roomName);
   }
});

muteButton.addEventListener("click",function () {
   muteFlag=!muteFlag;
   if(muteFlag ){
      userStream.getTracks()[0].enabled=false;
      muteButton.innerHTML='<i class="fas fa-solid fa-microphone-slash"></i>  Unmute';
   }
   else{
      userStream.getTracks()[0].enabled=true;
      muteButton.innerHTML='<i class="fas fa-solid fa-microphone"></i>  Mute';
   }
});


hideCameraButton.addEventListener("click",function () {
   hideCameraFlag=!hideCameraFlag;
   if(hideCameraFlag){
      userStream.getTracks()[1].enabled=false;
      hideCameraButton.innerHTML='<i class="fas fa-solid fa-video-slash"></i>  Show Camera';
   }
   else{
      userStream.getTracks()[1].enabled=true;
      hideCameraButton.innerHTML='<i class="fas fa-solid fa-video"></i>  Hide Camera';
   }
});





socket.on("created", function () {
   creator=true; //this person has created the room

   navigator.mediaDevices.getUserMedia(
      {
         audio: true,
         video: { width: 500, height: 500},
     })
      .then(function (stream) {
      userStream=stream;
      VideoChat.style = "display: inline";
      VideoChatLobby.style = "display:none"; //to remove video chat application from top when we have joined the call successfully
      afterEnteringRoom.style="display: ";
      TextChatLobby.style = "display: inline-block";
      ButtonGroup.style="display: flex";
      userVideo.srcObject=stream;
      userVideo.onloadedmetadata = function (e) {
      userVideo.play();
      };
   })
   .catch(function (err) {
      alert("Couldn't access user media");
   });

});

socket.on("joined", function () {
      creator=false; //this person has not created the room
      
      navigator.mediaDevices.getUserMedia(
         {
            audio: true,
            video: { width: 500, height: 500},
        })
      .then(function (stream) {
         userStream=stream;
         VideoChat.style = "display: inline";
         VideoChatLobby.style = "display:none"; //to remove video chat application from top when we have joined the call successfully
         ButtonGroup.style="display: flex";
         afterEnteringRoom.style="display: ";  
         TextChatLobby.style = "display: inline-block";
         userVideo.srcObject=stream;
         userVideo.onloadedmetadata = function (e) {
         userVideo.play();
         };
         socket.emit("ready",roomName);
      })
      .catch(function (err) {
         alert("Couldn't access user media");
      });

});

socket.on("full", function () {
   alert("Room is full, Can't Join")
});


socket.on("ready", function () {
   if(creator){
      rtcPeerConnection = new RTCPeerConnection(iceServers); //The RTCPeerConnection() constructor returns a newly-created RTCPeerConnection, which represents a connection between the local device and a remote peer.
      //here on shows receiving from peer
      rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
      rtcPeerConnection.ontrack = OnTrackFunction;
      
      //add shows sending to peer
      rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream); //0 for audio
      rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream); //1 fro video
      
      rtcPeerConnection.createOffer(
         function (offer) {
            rtcPeerConnection.setLocalDescription(offer); //local description for creator
            socket.emit("offer", offer, roomName);
         },
         function (error) {
            console.log(error);
         });
   }
});


socket.on("candidate", function (candidate) {
   let icecandidate = new RTCIceCandidate(candidate); 
   rtcPeerConnection.addIceCandidate(icecandidate);
});


socket.on("offer", function (offer) {
   if(!creator){
      rtcPeerConnection = new RTCPeerConnection(iceServers);

      rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
      rtcPeerConnection.ontrack = OnTrackFunction;
      
      rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream); //0 for audio
      rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream); //1 fro video
      rtcPeerConnection.setRemoteDescription(offer); //remote description for non-creator
      rtcPeerConnection.createAnswer(
         function (answer) {
            rtcPeerConnection.setLocalDescription(answer); //local description for non-creator
            socket.emit("answer", answer, roomName);
         },
         function (error) {
            console.log(error);
         });
   }
});


socket.on("answer", function (answer) {
   rtcPeerConnection.setRemoteDescription(answer); //remote description for creator
});


leaveRoomButton.addEventListener("click", function () {
   //let the server know that this person wants to leave the room
   socket.emit("leave",roomName);

   //change in UI
   VideoChat.style = "display: none";
   afterEnteringRoom.style="display: none";
   VideoChatLobby.style = "display:block";
   ButtonGroup.style = "display:none";
   TextChatLobby.style = "display: none";
   muteButton.innerHTML='<i class="fas fa-solid fa-microphone"></i>  Mute';
   hideCameraButton.innerHTML='<i class="fas fa-solid fa-video"></i>  Hide Camera';
   if(muteFlag){
      muteFlag=false;
   }
   if(hideCameraFlag){
      hideCameraFlag=false;
   }

   if(userVideo.srcObject) {
      userVideo.srcObject.getTracks()[0].stop();
      userVideo.srcObject.getTracks()[1].stop();
   }
 
   if(peerVideo.srcObject) { //if object is not null
      peerVideo.srcObject.getTracks()[0].stop();
      peerVideo.srcObject.getTracks()[1].stop(); 
   }
    
   //close the connection that was established
   if(rtcPeerConnection){
      rtcPeerConnection.onicecandidate = null;
      rtcPeerConnection.ontrack = null;
      rtcPeerConnection.close();
      rtcPeerConnection = null;
   }

   //all the above code was for the person's side who is leaving the room
});

socket.on("leave", function() {
   creator = true; //this person is now the creator becz they are the onlye person in the room 
   
   //clean the UI at the end of person who is receiving this event


   //close the connection that was established
   if(rtcPeerConnection){
      rtcPeerConnection.onicecandidate = null;
      rtcPeerConnection.ontrack = null;
      rtcPeerConnection.close();
      rtcPeerConnection = null;
   }

   //because the peer has left the room so we shouldn't see his/her video
   if(peerVideo.srcObject) { //if object is not null
      peerVideo.srcObject.getTracks()[0].stop();
      peerVideo.srcObject.getTracks()[1].stop(); 
   }
    
   
});

function OnIceCandidateFunction(event) {
   if(event.candidate){ //to make sure that we actually got back a candidate
      socket.emit("candidate",event.candidate,roomName);
   }
}

//this function get triggered when we start to get media streams from peer to which we are trying to communicate
function OnTrackFunction(event){
   peerVideo.srcObject = event.streams[0]; //streams is array of stream coming towards user from peers (in this case we will we receiving only one stream from our single peer therfore streams[0] is used)
   peerVideo.onloadedmetadata = function (e) {
   peerVideo.play();
   };
}