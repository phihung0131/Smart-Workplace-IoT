const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sendResponse = require("../helper/sendResponse");
const User = require("../models/User");

require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign({ ...user._doc }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const authController = {
  register: async (req, res) => {
    try {
      const { name, username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        username,
        password: hashedPassword,
      });
      await user.save();
      const token = generateToken(user);

      const dataUser = {
        name: user.name,
        username: user.username,
        token,
      };

      sendResponse(res, 201, "Đăng kí người dùng thành công", {
        user: dataUser,
      });
    } catch (error) {
      console.error(">>> Lỗi tạo người dùng:", error);
      sendResponse(res, 500, "Lỗi đăng kí người dùng mới", {
        error: error.toString(),
        stack: error.stack,
      });
    }
  },

  login: (req, res) => {
    try {
      const token = generateToken(req.user);

      const dataUser = {
        name: req.user.name,
        username: req.user.username,
        token,
      };

      sendResponse(res, 201, "Đăng nhập người dùng thành công", {
        user: dataUser,
      });
    } catch (error) {
      console.error(">>> Lỗi đăng nhập người dùng:", error);
      sendResponse(res, 500, "Lỗi đăng nhập người dùng", {
        error: error.toString(),
        stack: error.stack,
      });
    }
  },
};

module.exports = authController;
