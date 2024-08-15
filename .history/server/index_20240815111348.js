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
const serverName = process.env.NAME || "Unknown";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookies());
app.use(router);

const server = http.createServer(app);
const io = require("socket.io")(server);

const dataBase = process.env.MONGODB_URI;
mongoose
  .connect(dataBase, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const pubClient = createClient({ host: "redis", port: 6379 });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

// Chatroom

let numUsers = 0;

io.on("connection", (socket) => {
  socket.emit("my-name-is", serverName);

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
