// Lấy dữ liệu cảm biến 10 lần gần nhất
const mongoose = require("mongoose");
const SensorData = require("../models/SensorData");

const getLatestSensorData = async (roomId) => {
  try {
    // Lấy 10 giá trị cảm biến gần nhất
    const lightData = await SensorData.find({ type: "light", room: roomId })
      .sort({ createdAt: -1 })
      .limit(10);
    const temperatureData = await SensorData.find({
      type: "temperature",
      room: roomId,
    })
      .sort({ createdAt: -1 })
      .limit(10);
    const humidityData = await SensorData.find({
      type: "humidity",
      room: roomId,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    const latestSensorData = [];
    for (let i = 0; i < 10; i++) {
      latestSensorData.push({
        time: i,
        light: lightData[i] ? lightData[9 - i].value / 10 : null,
        temperature: temperatureData[9 - i] ? temperatureData[i].value : null,
        humidity: humidityData[9 - i] ? humidityData[i].value : null,
      });
    }

    return latestSensorData;
  } catch (err) {
    console.error("Lỗi lấy dữ liệu cảm biến gần nhất:", err);
  }
};

module.exports = {
  getLatestSensorData,
};
