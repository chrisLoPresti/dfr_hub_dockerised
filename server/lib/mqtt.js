let mqtt;

function setMQTT(mqttInstance) {
  mqtt = mqttInstance;
}

function getMQTT() {
  if (!mqtt) {
    throw new Error("MQTT instance is not initialized");
  }
  return mqtt;
}

module.exports = { setMQTT, getMQTT };
