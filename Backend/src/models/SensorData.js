const mongoose = require("mongoose");

const SensorDataSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    // humidity: String,
    // light: String,
    // temperature: String,
    type: String,
    value: Number,
  },
  { timestamps: true }
);

const SensorData = mongoose.model("SensorData", SensorDataSchema);

module.exports = SensorData;
