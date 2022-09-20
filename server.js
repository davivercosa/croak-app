const path = require("path");
const messageFormatter = require("./services/messageFormatter");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./services/users");

const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const port = 3000 || process.env.PORT;
const botName = "Ribbet-Ribbet";

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit(
      "message",
      messageFormatter(botName, `Welcome, ${username}, to the ${room} room`)
    ); // emits a message to the user who just logged in

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        messageFormatter(botName, `${username} has joined the chat!`)
      ); // emits a message to every user logged in, but the one who just logged in

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (userMessage) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit(
      "message",
      messageFormatter(user.username, userMessage)
    );
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        messageFormatter(botName, `${user.username} has left the chat!`)
      ); // emits to every client logged that an user disconnected

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server's up on port: ${port}`);
});
