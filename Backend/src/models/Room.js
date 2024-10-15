const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    name: String,
    adaName: String,
    adaKey: String,
    currentUser: String,
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
