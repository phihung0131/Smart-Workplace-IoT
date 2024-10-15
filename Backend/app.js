const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const dbConnection = require("./src/config/database");
const {
  initializeAdafruitHandlers,
} = require("./src/services/adafruitHandler");
const routes = require("./src/routes");
const passport = require("./src/config/passport");
const { setupSocket } = require("./src/services/socket.js"); // Import setupSocket

const app = express();
const server = http.createServer(app);

const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 8081;

// Middleware: Enable CORS for specified origin
let corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));

// Thiết lập Socket.IO
setupSocket(server); // Khởi tạo io từ server

// Middleware: Parse requests with JSON payload
app.use(express.json());

// Middleware: Parse requests with x-www-form-urlencoded content type
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

// Routes
app.use("/api/v1", routes);

// Connect to the database
dbConnection.connect();

// Kết nối adafruit
initializeAdafruitHandlers();

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
