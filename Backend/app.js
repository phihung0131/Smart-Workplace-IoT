const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const dbConnection = require("./src/config/database");
const adafruitHandler = require("./src/services/adafruitHandler");
const routes = require("./src/routes");
const passport = require("./src/config/passport");
const { setupSocket } = require("./src/services/socket.js");

const app = express();
const server = http.createServer(app);

const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 8081;

// Middleware: Enable CORS
let corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));

// Thiết lập Socket.IO
setupSocket(server);

// Middleware: Parse JSON và URL-encoded requests
app.use(express.json({ limit: '100mb' })); 
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Khởi tạo Passport
app.use(passport.initialize());

// Routes
app.use("/api/v1", routes);

// Kết nối database và khởi động server
dbConnection
  .connect()
  .then(async () => {
    try {
      // Singleton Pattern: Sử dụng instance duy nhất của AdafruitHandler
      await adafruitHandler.initializeHandlers();
      server.listen(port, hostname, () => {
        console.log(`Server đang chạy tại http://${hostname}:${port}/`);
      });
    } catch (error) {
      console.error("Lỗi khởi tạo AdafruitHandler:", error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Lỗi kết nối cơ sở dữ liệu:", error);
    process.exit(1);
  });
