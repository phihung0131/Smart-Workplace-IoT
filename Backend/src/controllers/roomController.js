const sendResponse = require("../helper/sendResponse");
const { controlRoomDevice } = require("../services/adafruitHandler");
const User = require("../models/User");
const SensorData = require("../models/SensorData");
const Device = require("../models/Device");
const Room = require("../models/Room");
const UserRoom = require("../models/UserRoom");

require("dotenv").config();

const roomController = {
  addRoom: async (req, res) => {
    try {
      const { adaName, adaKey } = req.body;
      const room = await Room.findOne({ adaName, adaKey });

      if (!room) {
        return sendResponse(res, 404, "Adafruit name/key không đúng");
      }

      const userRoom = await UserRoom.findOne({
        userId: req.user._id,
        roomId: room._id,
      });

      if (userRoom) {
        return sendResponse(res, 400, "Người dùng đã thêm phòng này rồi");
      }

      const newUserRoom = new UserRoom({
        userId: req.user._id,
        roomId: room._id,
      });

      await newUserRoom.save();
      sendResponse(
        res,
        201,
        `Thêm phòng thành ${room.name} thành công`,
        newUserRoom
      );
    } catch (err) {
      console.error(">>>>>> Lỗi thêm phòng: ", err);
      sendResponse(res, 500, "Lỗi hệ thống", { error: err.toString() });
    }
  },

  getRooms: async (req, res) => {
    try {
      const userRoom = await UserRoom.find({
        userId: req.user._id,
      })
        .populate("roomId", "name adaName adaKey currentUser")
        .select("roomId");

      sendResponse(res, 200, `Lấy danh sách phòng thành công`, userRoom);
    } catch (err) {
      console.error(">>>>>> Lỗi lấy danh sách phòng: ", err);
      sendResponse(res, 500, "Lỗi hệ thống", { error: err.toString() });
    }
  },

  getRoomData: async (req, res) => {
    try {
      const { roomId } = req.body;
      const light = await SensorData.findOne({ type: "light", room: roomId })
        .sort({ createdAt: -1 })
        .limit(1);
      const humidity = await SensorData.findOne({
        type: "humidity",
        room: roomId,
      })
        .sort({ createdAt: -1 })
        .limit(1);
      const temperature = await SensorData.findOne({
        type: "temperature",
        room: roomId,
      })
        .sort({ createdAt: -1 })
        .limit(1);
      const auto_mode = await Device.findOne({
        type: "auto_mode",
        room: roomId,
      })
        .sort({ createdAt: -1 })
        .limit(1);
      const fan = await Device.findOne({ type: "fan", room: roomId })
        .sort({ createdAt: -1 })
        .limit(1);
      const led = await Device.findOne({ type: "led", room: roomId })
        .sort({ createdAt: -1 })
        .limit(1);
      const pump = await Device.findOne({ type: "pump", room: roomId })
        .sort({ createdAt: -1 })
        .limit(1);

      const resData = {
        light: light.value,
        humidity: humidity.value,
        temperature: temperature.value,
        auto_mode: auto_mode.activity,
        fan: fan.activity,
        led: led.activity,
        pump: pump.activity,
      };
      sendResponse(res, 200, `Lấy data phòng thành công`, {
        roomData: resData,
      });
    } catch (err) {
      console.error(">>>>>> Lỗi lấy data phòng: ", err);
      sendResponse(res, 500, "Lỗi hệ thống", { error: err.toString() });
    }
  },

  controlDevice: async (req, res) => {
    try {
      const { roomId, device, activity } = req.body;
      await controlRoomDevice(roomId, device, activity);
      sendResponse(res, 200, `Lấy data phòng thành công`);
    } catch (err) {
      console.error(">>>>>> Lỗi lấy data phòng: ", err);
      sendResponse(res, 500, "Lỗi hệ thống", { error: err.toString() });
    }
  },
};
module.exports = roomController;
