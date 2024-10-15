const jwt = require("jsonwebtoken");
const sendResponse = require("../helper/sendResponse");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return sendResponse(res, 401, "Không có token, quyền truy cập bị từ chối");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    sendResponse(res, 401, "Token không hợp lệ");
  }
};

module.exports = { verifyToken };
