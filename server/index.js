const express = require("express");
const http = require("http");
const router = require("./routes");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookies = require("cookie-parser");
const cors = require("cors");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const mqtt = require("mqtt");
const { setIO } = require("./lib/socket");
const { setMQTT } = require("./lib/mqtt");

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
setIO(io);
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
require("./lib/socketHandler")(io);
const mqttClient = mqtt.connect("mqtt://nj.unmannedlive.com:1883");
setMQTT(mqttClient);
require("./lib/mqttHandler")(mqttClient);

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
