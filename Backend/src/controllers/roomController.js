const sendResponse = require("../helper/sendResponse");
const User = require("../models/User");
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
};
module.exports = roomController;
