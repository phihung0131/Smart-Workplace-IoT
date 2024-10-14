const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    user: String, //username/none
    status: String, // in/out
  },
  { timestamps: true }
);

const History = mongoose.model("History", HistorySchema);

module.exports = History;
