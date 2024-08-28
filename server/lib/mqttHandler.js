module.exports = (client) => {
  client.on("connect", () => {
    console.log("mqtt connected");
  });

  client.on("error", () => {
    console.log(error);
    client.end();
  });
};
