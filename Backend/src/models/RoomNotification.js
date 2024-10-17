const mongoose = require("mongoose");

const RoomNotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    duration: Number, // Thời gian sử dụng phòng (phút)
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const RoomNotification = mongoose.model("RoomNotification", RoomNotificationSchema);

module.exports = RoomNotification;
