const sendResponse = require("../helper/sendResponse");
const adafruitHandler = require("../services/adafruitHandler");
const SensorData = require("../models/SensorData");
const Device = require("../models/Device");
const Room = require("../models/Room");
const UserRoom = require("../models/UserRoom");
const RoomNotification = require("../models/RoomNotification");
const History = require("../models/History");

require("dotenv").config();

// Controller cho các chức năng liên quan đến phòng
const roomController = {
  // Thêm phòng mới cho người dùng
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
      sendResponse(res, 201, `Thêm phòng ${room.name} thành công`, newUserRoom);
    } catch (err) {
      console.error("Lỗi thêm phòng: ", err);
      sendResponse(res, 500, "Lỗi hệ thống", { error: err.toString() });
    }
  },

  // Lấy danh sách phòng của người dùng
  getRooms: async (req, res) => {
    try {
      const userRooms = await UserRoom.find({
        userId: req.user._id,
      })
        .populate("roomId", "name adaName adaKey currentUser")
        .select("roomId");

      sendResponse(res, 200, `Lấy danh sách phòng thành công`, userRooms);
    } catch (err) {
      console.error("Lỗi lấy danh sách phòng: ", err);
      sendResponse(res, 500, "Lỗi hệ thống", { error: err.toString() });
    }
  },

  // Lấy dữ liệu hiện tại của phòng
  getRoomData: async (req, res) => {
    try {
      const { roomId } = req.body;
      const [light, humidity, temperature, auto_mode, fan, led, pump] =
        await Promise.all([
          SensorData.findOne({ type: "light", room: roomId })
            .sort({ createdAt: -1 })
            .limit(1),
          SensorData.findOne({ type: "humidity", room: roomId })
            .sort({ createdAt: -1 })
            .limit(1),
          SensorData.findOne({ type: "temperature", room: roomId })
            .sort({ createdAt: -1 })
            .limit(1),
          Device.findOne({ type: "auto_mode", room: roomId })
            .sort({ createdAt: -1 })
            .limit(1),
          Device.findOne({ type: "fan", room: roomId })
            .sort({ createdAt: -1 })
            .limit(1),
          Device.findOne({ type: "led", room: roomId })
            .sort({ createdAt: -1 })
            .limit(1),
          Device.findOne({ type: "pump", room: roomId })
            .sort({ createdAt: -1 })
            .limit(1),
        ]);

      const resData = {
        light: light?.value,
        humidity: humidity?.value,
        temperature: temperature?.value,
        auto_mode: auto_mode?.activity,
        fan: fan?.activity,
        led: led?.activity,
        pump: pump?.activity,
      };
      sendResponse(res, 200, `Lấy data phòng thành công`, {
        roomData: resData,
      });
    } catch (err) {
      console.error("Lỗi lấy data phòng: ", err);
      sendResponse(res, 500, "Lỗi hệ thống", { error: err.toString() });
    }
  },

  // Điều khiển thiết bị trong phòng
  controlDevice: async (req, res) => {
    try {
      const { roomId, device, activity, username } = req.body;

      const room = await Room.findById(roomId);
      if (room.currentUser !== username) {
        return sendResponse(res, 403, "Không có quyền điều khiển phòng");
      }

      await adafruitHandler.controlRoomDevice(roomId, device, activity);
      sendResponse(res, 200, `Điều khiển phòng thành công`);
    } catch (err) {
      console.error("Lỗi điều khiển phòng: ", err);
      sendResponse(res, 500, "Lỗi hệ thống", { error: err.toString() });
    }
  },

  // Cài đặt thông báo sử dụng phòng
  setRoomNotification: async (req, res) => {
    try {
      const { duration, isEnabled } = req.body;
      const userId = req.user._id;

      let notification = await RoomNotification.findOne({
        user: userId,
      });
      if (notification) {
        notification.duration = duration;
        notification.isEnabled = isEnabled;
        await notification.save();
      } else {
        notification = new RoomNotification({
          user: userId,
          duration,
          isEnabled,
        });
        await notification.save();
      }
      console.log(notification);
      sendResponse(res, 200, "Cài đặt thông báo thành công", notification);
    } catch (err) {
      console.error("Lỗi cài đặt thông báo phòng:", err);
      sendResponse(res, 500, "Lỗi hệ thống", { error: err.toString() });
    }
  },

  // Lấy lịch sử sử dụng phòng
  getRoomUsageHistory: async (req, res) => {
    try {
      const { roomId } = req.body;

      // Tìm kiếm lịch sử sử dụng phòng theo roomId và userId
      const history = await History.find({
        room: roomId,
        // user: req.user.username,
      }).sort({ createdAt: -1 });

      // Định dạng dữ liệu lịch sử
      const formattedHistory = history.map((entry) => ({
        user: entry.user,
        status: entry.status,
        time: entry.createdAt.toLocaleString(), // Chuyển đổi thời gian thành chuỗi dễ đọc
      }));

      sendResponse(
        res,
        200,
        "Lấy lịch sử sử dụng phòng thành công",
        formattedHistory
      );
    } catch (err) {
      console.error("Lỗi lấy lịch sử sử dụng phòng:", err);
      sendResponse(res, 500, "Lỗi hệ thống", { error: err.toString() });
    }
  },
};

module.exports = roomController;
