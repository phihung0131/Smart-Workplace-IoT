const express = require("express");
const passport = require("passport");

// const authMiddleware = require("../middlewares/auth");
const authController = require("../controllers/authController");

const router = express.Router();

// Đăng ký tài khoản local
router.post("/register", authController.register);

// Đăng nhập local
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  authController.login
);

module.exports = router;
