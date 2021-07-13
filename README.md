# Vichat - Microsoft Teams Clone
***
Welcome to **Vichat** which is a video calling and chat application.

# Tech Stack
***
* HTML
* CSS
* Bootstrap
* JavaScript
* Node.js
* Express.js
* socket.io
* webRTC

# One to one video call
***
1. Enter url( https://videonchat.herokuapp.com/ ) for opening application on your system

![ss1](https://user-images.githubusercontent.com/64426164/125456119-140f1367-c2fa-4b82-9caa-8b1037ad5816.PNG)


2. Now the user is asked to enter the room name - The room name entered by the user is checked if this room is already created or not. If there doesn't exist any room with the same name then a new room is created and the user joins in. User can share this unique room name with the person with whom they want to connect.

![ss2](https://user-images.githubusercontent.com/64426164/125459141-fdbbb302-a2ad-4483-8362-4dbd862312cd.PNG)


 Only 2 persons can join a particular room at the same time and if third person tries to enter the room then he/she will get an alert *Room is full, cann't join*


![ss3](https://user-images.githubusercontent.com/64426164/125461539-933ace49-9b3a-445d-b5b8-1f645e2de16c.PNG)


3. Now both the users have successfully joined - both users can see each others video on their screens. 

![ss4](https://user-images.githubusercontent.com/64426164/125461536-e1a289d6-6f1e-4c95-bd0e-8551cc8f6c90.PNG)


4. Other functionalities - Users are provided with different functionalities such as mute/unmute audio, hide camera/show camera, leave room and chat box.
   
   Chat box- Firstly both users will enter their username and after that they can send messages to each other. Their messages can be seen in the output window along with their user names.

![ss5](https://user-images.githubusercontent.com/64426164/125461531-4df1011a-78a0-4569-86a6-64f6b66bba0b.PNG)


5. Hide camera - User can hide their video. Here user2 has hide his/her video that's why only user1's video can be seen on the screen

![ss](https://user-images.githubusercontent.com/64426164/125463648-5a390198-280f-4b79-8601-17ec1cfcf2ba.PNG)


6. Leave room - When user clicks on the leave room button then user will get back to the previous screen from where they can again enter the same room.

![ss6](https://user-images.githubusercontent.com/64426164/125461525-d9853eb5-0f16-4ef7-94b5-25179e9641d4.PNG)


When the user clicks on the join button then he/she enters the same room in which they were previously present and all the chats between the two users are still present.

![ss5](https://user-images.githubusercontent.com/64426164/125461531-4df1011a-78a0-4569-86a6-64f6b66bba0b.PNG)



# Use of Agile methodology in my project
***
1. The whole project was built in 4 sprint.
2. Each sprint lasted for one week.
3. At the end of each sprint I used to have 1:1 meetings with my mentors to show them the current progress and what else can be done to make project better.


# LAN v/s WAN
***
Vichat works only when both devices are connected with same wifi/network because here I have used *STUN* servers only. To make it work on **Wide Area Network** *TURN* servers would be required but they are not avalaible free of cost that's why I have used *STUN* servers.

# Link of application
***
https://videonchat.herokuapp.com/
