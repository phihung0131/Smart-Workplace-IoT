const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");

router.use("/", authRoutes);

module.exports = router;
