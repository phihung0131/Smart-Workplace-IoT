const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnection = require("./src/config/database");
const adafruitHandle = require("./src/services/adafruitHandler");
const routes = require("./src/routes");
const passport = require("./src/config/passport");


const app = express();

const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 8081;

// Middleware: Enable CORS for specified origin
let corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware: Parse requests with JSON payload
app.use(express.json());

// Middleware: Parse requests with x-www-form-urlencoded content type
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

// Routes
app.use("/api/v1", routes);

// Connect to the database
dbConnection.connect();

adafruitHandle();

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
