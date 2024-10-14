const mongoose = require("mongoose");

const SensorDataSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    humidity: String,
    lightLevel: String,
    temperature: String,
  },
  { timestamps: true }
);

const SensorData = mongoose.model("SensorData", SensorDataSchema);

module.exports = SensorData;
