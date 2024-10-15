const mongoose = require("mongoose");

const UserRoomSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  },
  { timestamps: true }
);

const UserRoom = mongoose.model("UserRoom", UserRoomSchema);

module.exports = UserRoom;
