const express = require("express");
const http = require("http");
const router = require("./routes");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookies = require("cookie-parser");
const cors = require("cors");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookies());
app.use(router);

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", // Allowing front-end running port 3000
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.set("io", io);

const dataBase = process.env.MONGODB_URI;
mongoose
  .connect(dataBase, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const pubClient = createClient({ host: "redis", port: 6379 }).on(
  "error",
  (err) => console.log("Redis Client Error", err)
);
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

// Chatroom

let numUsers = 0;

io.on("connection", (socket) => {
  console.log(`a user connected with socket id: ${socket.id}`);

  socket.on("user-connected", async (message) => {
    const sockets = await io.fetchSockets();
    console.log(sockets.map(({ id }) => id));
    const existingUserSocket = sockets.find(
      ({ userId }) => userId === message.user
    );
    if (existingUserSocket) {
      existingUserSocket.emit("duplicate-session-started", {
        message: "You are already logged in on another device",
      });
    }
    socket.userId = message.user;
  });

  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on("new message", (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit("new message", {
      username: socket.username,
      message: data,
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on("add user", (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit("login", {
      numUsers: numUsers,
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit("user joined", {
      username: socket.username,
      numUsers: numUsers,
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on("typing", () => {
    socket.broadcast.emit("typing", {
      username: socket.username,
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing", {
      username: socket.username,
    });
  });

  // when the user disconnects.. perform this
  socket.on("disconnect", () => {
    console.log("user disconnected: ", socket.userId);
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit("user left", {
        username: socket.username,
        numUsers: numUsers,
      });
    }
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
