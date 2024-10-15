const express = require("express");
const { verifyToken } = require("../middleware/auth");
const roomController = require("../controllers/roomController");
const router = express.Router();

// Thêm phòng mới
router.post("/addroom", [verifyToken], roomController.addRoom);

router.get("/rooms", [verifyToken], roomController.getRooms);

router.post("/room/device", [verifyToken], roomController.controlDevice);

router.post("/roomdata", [verifyToken], roomController.getRoomData);


module.exports = router;
