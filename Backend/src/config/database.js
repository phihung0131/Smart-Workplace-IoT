const mongoose = require("mongoose");
require("dotenv").config();

class DatabaseConnection {
  constructor() {
    this.mongoose = mongoose;
    this.dbState = [
      { value: 0, label: "Disconnected" },
      { value: 1, label: "Connected" },
      { value: 2, label: "Connecting" },
      { value: 3, label: "Disconnecting" },
    ];
  }

  async connect() {
    if (this.mongoose.connection.readyState !== 0) {
      console.log("Already connected to database.");
      return;
    }

    try {
      const db_uri = process.env.DB_URI;
      const db_name = process.env.DB_NAME;
      const db_user = process.env.DB_USER;
      const db_pass = process.env.DB_PASS;

      await this.mongoose.connect(db_uri, {
        dbName: db_name,
        user: db_user,
        pass: db_pass,
      });

      const state = Number(this.mongoose.connection.readyState);
      console.log(this.dbState.find((f) => f.value === state).label, "to database.");
    } catch (error) {
      console.log("Error connecting to database: ", error);
    }
  }

  getConnection() {
    return this.mongoose.connection;
  }
}

// Singleton instance
const instance = new DatabaseConnection();
Object.freeze(instance);

module.exports = instance;