const mqtt = require("mqtt");
const Room = require("../models/Room");
const SensorData = require("../models/SensorData");
const Device = require("../models/Device");
const History = require("../models/History");
const { notifyAllClients } = require("./socket");

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
    const result = await SensorData.create({
      room: room._id,
      type: sensor,
      value,
    });

    notifyAllClients("room-sensors-update", {
      sensor: result,
    });
    // console.log(sensor);
    // const result = await SensorData.findOneAndUpdate(
    //   { room: room._id },
    //   update,
    //   {
    //     upsert: true,
    //     new: true,
    //   }
    // );
    // // console.log(result);
  }

  async updateDeviceStatus(room, deviceType, status) {
    const result = await Device.findOneAndUpdate(
      { room: room._id, type: deviceType },
      { activity: status },
      { upsert: true, new: true }
    );
    console.log(result);
    notifyAllClients("room-device-update", {
      device: result,
    });
  }

  async updateUserHistory(room, userInfo) {
    const regex = /(.+) được gán cho (.+) lúc (.+)/;
    const regexRevoke = /Thu hồi quyền điều khiển từ (.+) lúc (.+)/;
    // console.log(userInfo);
    let match = userInfo.match(regex);
    if (match) {
      const [, , username, timestamp] = match;
      await History.create({
        room: room._id,
        user: username,
        status: "in",
      });
      room.currentUser = username;
      await room.save();
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
        room.currentUser = "none";
        await room.save();
      }
    }

    notifyAllClients("room-status-update", {
      roomId: room._id,
      currentUser: room.currentUser,
    });
  }
}

// Sử dụng
async function initializeAdafruitHandlers() {
  const rooms = await Room.find();
  rooms.forEach((room) => {
    new AdafruitHandler(room.adaName, room.adaKey);
  });
}

// Public
const controlRoomDevice = async (roomId, device, activity) => {
  try {
    // Tìm phòng dựa trên roomId
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    // Kết nối với Adafruit IO
    const client = mqtt.connect("mqtts://io.adafruit.com", {
      username: room.adaName, // Tên tài khoản Adafruit
      password: room.adaKey, // Key từ Adafruit
    });

    return new Promise((resolve, reject) => {
      client.on("connect", () => {
        console.log("Connected to Adafruit IO");

        const feedName = `${room.adaName}/feeds/${device}`; // Định nghĩa tên feed dựa trên room và device
        console.log(`Publishing to feed: ${feedName}`);

        // Publish activity (on/off hoặc một giá trị khác) lên feed của thiết bị
        client.publish(feedName, activity, (err) => {
          if (err) {
            console.error("Error publishing to Adafruit:", err);
            client.end(); // Ngắt kết nối trong trường hợp lỗi
            reject(err);
          } else {
            console.log(`Successfully published ${activity} to ${feedName}`);

            // Ngắt kết nối sau khi publish xong
            client.end(false, () => {
              console.log("Disconnected from Adafruit IO");
              resolve();
            });
          }
        });
      });

      // Xử lý lỗi khi kết nối thất bại
      client.on("error", (err) => {
        console.error("MQTT connection error:", err);
        client.end(); // Đảm bảo ngắt kết nối trong trường hợp có lỗi
        reject(err);
      });
    });
  } catch (error) {
    console.error("Error controlling device:", error);
    throw error; // Ném lỗi để xử lý phía trên nếu cần
  }
};

// initializeAdafruitHandlers().catch(console.error);

module.exports = { initializeAdafruitHandlers, controlRoomDevice };
