const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const roomRoutes = require("./roomRoutes");

router.use("/", authRoutes);
router.use("/", roomRoutes);

module.exports = router;
