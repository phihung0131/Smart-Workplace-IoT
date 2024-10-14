const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    username: {
      type: String,
      unique: [true, "Username đã được sử dụng"],
    },
    password: String,
    adafruitConnections: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
