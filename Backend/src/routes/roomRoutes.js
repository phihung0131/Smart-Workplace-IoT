const express = require("express");
const { verifyToken } = require("../middleware/auth");
const roomController = require("../controllers/roomController");
const router = express.Router();

// Thêm phòng mới
router.post("/addroom", [verifyToken], roomController.addRoom);

router.get("/rooms", [verifyToken], roomController.getRooms);

module.exports = router;
