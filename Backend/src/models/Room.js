const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    nane: String,
    adaName: String,
    adaKey: String,
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
