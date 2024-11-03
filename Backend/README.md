# 🏢 SmartWork Backend

Backend server for the SmartWork IoT workspace management system built with Node.js, Express, and MongoDB.

## ✨ Features

- 🌐 RESTful API
- 🔄 Real-time updates with Socket.IO
- 🗄️ MongoDB integration
- 🔑 JWT authentication
- 📡 MQTT integration with Adafruit IO
- ⚙️ Device control management
- 📊 Sensor data logging
- 👥 User presence tracking

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - Real-time communication
- **Passport** - Authentication
- **JWT** - Token-based auth
- **MQTT** - IoT communication
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
backend/
├── src/
│   ├── adapters/          # Adapter pattern implementations
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── helper/            # Helper functions
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── observers/         # Observer pattern implementations
│   ├── routes/            # API routes
│   └── services/          # Business logic
├── .env                    # Environment variables
├── app.js                 # Application entry point
└── package.json           # Project dependencies
```

## 📊 Models

- **User** - User account information
- **Room** - Room configuration and status
- **Device** - IoT device states
- **SensorData** - Environmental sensor readings
- **History** - Room usage history
- **RoomNotification** - User notification settings

## 📡 API Endpoints

### Authentication
- `POST /api/v1/register` - Register new user
- `POST /api/v1/login` - User login

### Rooms
- `GET /api/v1/rooms` - Get user's rooms
- `POST /api/v1/addroom` - Add new room
- `POST /api/v1/room/device` - Control room device
- `POST /api/v1/roomdata` - Get room sensor data
- `POST /api/v1/room/notification` - Set notification preferences
- `POST /api/v1/room/history` - Get room usage history

## 📝 Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   HOSTNAME=localhost
   PORT=8080
   DB_URI=your_mongodb_uri
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASS=your_db_password
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Start the production server:
   ```bash
   npm start
   ```

## 🎨 Design Patterns

- **Singleton** - AdafruitHandler instance
- **Observer** - Real-time notifications
- **Adapter** - Adafruit IO integration

## 🌐 WebSocket Events

- `room-sensors-update` - Real-time sensor data updates
- `room-device-update` - Device state changes
- `room-status-update` - Room occupancy status
- `room-usage-notification` - Usage time notifications
