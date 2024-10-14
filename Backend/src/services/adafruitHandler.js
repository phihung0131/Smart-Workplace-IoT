const mqtt = require("mqtt");
const Room = require("../models/Room");
const SensorData = require("../models/SensorData");
const Device = require("../models/Device");
const History = require("../models/History");

class AdafruitHandler {
  constructor(adaName, adaKey) {
    this.client = mqtt.connect("mqtts://io.adafruit.com", {
      username: adaName,
      password: adaKey,
    });

    this.client.on("connect", () => {
      console.log("Connected to Adafruit IO");
      this.subscribeToFeeds();
    });

    this.client.on("message", (topic, message) => {
      this.handleMessage(topic, message);
    });
  }

  subscribeToFeeds() {
    const feeds = [
      "auto_mode",
      "fan",
      "humidity",
      "led",
      "light",
      "pump",
      "temperature",
      "user",
    ];
    feeds.forEach((feed) => {
      this.client.subscribe(`${this.client.options.username}/feeds/${feed}`);
    });
  }

  async handleMessage(topic, message) {
    const feed = topic.split("/").pop();
    const value = message.toString();

    try {
      const room = await Room.findOne({
        adaName: this.client.options.username,
      });
      if (!room) {
        console.log("Room not found");
        return;
      }

      switch (feed) {
        case "humidity":
        case "light":
        case "temperature":
          await this.updateSensorData(room, feed, value);
          break;
        case "auto_mode":
        case "fan":
        case "led":
        case "pump":
          await this.updateDeviceStatus(room, feed, value);
          break;
        case "user":
          await this.updateUserHistory(room, value);
          break;
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }

  async updateSensorData(room, sensor, value) {
    const update = {};
    update[sensor] = value;

    const result = await SensorData.findOneAndUpdate(
      { room: room._id },
      update,
      {
        upsert: true,
        new: true,
      }
    );

    console.log("Sensors");
  }

  async updateDeviceStatus(room, deviceType, status) {
    const result = await Device.findOneAndUpdate(
      { room: room._id, type: deviceType },
      { activity: status },
      { upsert: true, new: true }
    );
    console.log(result);
  }

  async updateUserHistory(room, userInfo) {
    const regex = /(.+) được gán cho (.+) lúc (.+)/;
    const regexRevoke = /Thu hồi quyền điều khiển từ (.+) lúc (.+)/;
    console.log(userInfo);
    let match = userInfo.match(regex);
    if (match) {
      const [, , username, timestamp] = match;
      await History.create({
        room: room._id,
        user: username,
        status: "in",
      });
    } else {
      match = userInfo.match(regexRevoke);
      if (match) {
        const [, username, timestamp] = match;
        await History.create({
          room: room._id,
          user: username,
          status: "out",
        });
      } else if (userInfo === "none") {
        await History.create({
          room: room._id,
          user: "none",
          status: "out",
        });
      }
    }
  }
}

// Sử dụng
async function initializeAdafruitHandlers() {
  const rooms = await Room.find();
  rooms.forEach((room) => {
    new AdafruitHandler(room.adaName, room.adaKey);
  });
}

// initializeAdafruitHandlers().catch(console.error);

module.exports = initializeAdafruitHandlers;
