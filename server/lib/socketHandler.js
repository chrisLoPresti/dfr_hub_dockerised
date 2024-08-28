const { getMQTT } = require("./mqtt");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("socket connected");
    socket.on("disconnect", () => {
      console.log("disconnecting!!!!: ", socket.id);
      const mqttClient = getMQTT();
      mqttClient;
    });

    socket.on("subscribe-to-real-time-updates", (sn) => {
      try {
        const mqttClient = getMQTT();
        mqttClient.subscribe(`thing/product/${sn}/osd`);
        mqttClient.on("message", (topic, message) => {
          if (topic === `thing/product/${sn}/osd`) {
            socket.emit("real-time-update", message.toString());
          }
        });
      } catch (err) {
        socket.emit("subscribe-to-real-time-updates-failed", err);
      }
    });

    socket.on("unsubscribe-to-real-time-updates", (sn) => {
      try {
        const mqttClient = getMQTT();
        mqttClient.unsubscribe(`thing/product/${sn}/osd`);
      } catch (err) {
        socket.emit("unsubscribe-to-real-time-updates-failed", err);
      }
    });
  });
};
