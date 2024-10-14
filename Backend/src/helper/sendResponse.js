const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status: status >= 200 && status < 300 ? "success" : "error",
    message,
    data,
  });
};

module.exports = sendResponse;
