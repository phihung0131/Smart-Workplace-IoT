const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    type: String,
    activity: String, // on/off
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", DeviceSchema);

module.exports = Device;
