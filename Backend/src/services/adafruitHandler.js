const mqtt = require("mqtt");
const Room = require("../models/Room");
const SensorData = require("../models/SensorData");
const Device = require("../models/Device");
const History = require("../models/History");
const RoomNotification = require("../models/RoomNotification");
const User = require("../models/User");
const { notifyAllClients, notifyUser } = require("./socket");
const sensorDataObserver = require("../observers/sensorDataObserver");
const AdafruitAdapter = require("../adapters/adafruitAdapter");
const { getLatestSensorData } = require("../services/room");

// Singleton Pattern: Đảm bảo chỉ có một instance của AdafruitHandler
class AdafruitHandler {
  constructor() {
    this.adapters = new Map();
    this.initialized = false;
  }

  async initializeHandlers() {
    if (this.initialized) {
      console.log("AdafruitHandler đã được khởi tạo trước đó.");
      return;
    }

    const rooms = await Room.find();
    for (const room of rooms) {
      // Adapter Pattern: Sử dụng AdafruitAdapter để kết nối với Adafruit IO
      const adapter = new AdafruitAdapter(room.adaName, room.adaKey);
      await adapter.connect();
      this.adapters.set(room.adaName, adapter);
      this.subscribeToFeeds(adapter, room);
    }
    this.initialized = true;
    console.log("AdafruitHandler đã được khởi tạo thành công.");
  }

  // Đăng ký lắng nghe các feed từ Adafruit IO
  subscribeToFeeds(adapter, room) {
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
      adapter.subscribe(feed, (message) =>
        this.handleMessage(room, feed, message)
      );
    });
  }

  // Xử lý tin nhắn nhận được từ Adafruit IO
  async handleMessage(room, feed, message) {
    const value = message.toString();

    try {
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
      console.error("Lỗi xử lý tin nhắn:", error);
    }
  }

  // Cập nhật dữ liệu cảm biến
  async updateSensorData(room, sensor, value) {
    const result = await SensorData.create({
      room: room._id,
      type: sensor,
      value,
    });

    const latestSensorData = await getLatestSensorData(room._id);
    // console.log(latestSensorData);

    // Observer Pattern: Thông báo cho tất cả các observers về dữ liệu cảm biến mới
    notifyAllClients("room-sensors-update", {
      sensor: { ...result._doc, latestSensorData },
    });

    sensorDataObserver.notify({
      roomId: room._id,
      sensor,
      value,
    });
  }

  // Cập nhật trạng thái thiết bị
  async updateDeviceStatus(room, deviceType, status) {
    const result = await Device.findOneAndUpdate(
      { room: room._id, type: deviceType },
      { activity: status },
      { upsert: true, new: true }
    );
    notifyAllClients("room-device-update", { device: result });
  }

  // Cập nhật lịch sử sử dụng phòng
  async updateUserHistory(room, userInfo) {
    const regex = /(.+) được gán cho (.+) lúc (.+)/;
    const regexRevoke = /Thu hồi quyền điều khiển từ (.+) lúc (.+)/;
    let match = userInfo.match(regex);
    if (match) {
      const [, , username] = match;
      await History.create({
        room: room._id,
        user: username,
        status: "in",
      });
      room.currentUser = username;
      await room.save();
      this.startRoomUsageTimer(room._id, username);
    } else {
      match = userInfo.match(regexRevoke);
      if (match) {
        const [, username] = match;
        await History.create({
          room: room._id,
          user: username,
          status: "out",
        });
        this.stopRoomUsageTimer(room._id, username);
      } else if (userInfo === "none") {
        await History.create({
          room: room._id,
          user: "none",
          status: "out",
        });
        room.currentUser = "none";
        await room.save();
        this.stopRoomUsageTimer(room._id, room.currentUser);
      }
    }

    notifyAllClients("room-status-update", {
      roomId: room._id,
      currentUser: room.currentUser,
    });
  }

  // Bắt đầu đếm thời gian sử dụng phòng
  async startRoomUsageTimer(roomId, username) {
    const user = await User.findOne({ username });
    if (!user) return;

    const notification = await RoomNotification.findOne({
      room: roomId,
      user: user._id,
    });
    if (!notification || !notification.isEnabled) return;

    setTimeout(() => {
      notifyUser(user._id, "room-usage-notification", {
        message: `Bạn đã sử dụng phòng được ${notification.duration} phút.`,
        roomId,
      });
    }, notification.duration * 60 * 1000);
  }

  // Dừng đếm thời gian sử dụng phòng
  async stopRoomUsageTimer(roomId, username) {
    // Implement logic to stop the timer if needed
  }

  // Điều khiển thiết bị trong phòng
  async controlRoomDevice(roomId, device, activity) {
    if (!this.initialized) {
      await this.initializeHandlers();
    }

    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error("Không tìm thấy phòng");
      }

      const adapter = this.adapters.get(room.adaName);
      if (!adapter) {
        throw new Error("Không tìm thấy Adapter cho phòng này");
      }

      await adapter.publish(device, activity);
      console.log(
        `Đã xuất bản thành công ${activity} đến ${device} cho phòng ${room.name}`
      );
    } catch (error) {
      console.error("Lỗi điều khiển thiết bị:", error);
      throw error;
    }
  }
}

// Singleton Pattern: Tạo và xuất một instance duy nhất của AdafruitHandler
const adafruitHandlerInstance = new AdafruitHandler();
module.exports = adafruitHandlerInstance;
