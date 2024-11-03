# 🌐 SmartWork Frontend

Frontend application for the SmartWork IoT workspace management system built with React.

## ✨ Features

- 🔑 User authentication (login/register)
- 🏢 Room management and monitoring
- 📊 Real-time sensor data visualization
- 🎛️ Device control interface
- 📈 Room usage history tracking
- 🔔 User notifications system
- 📱 Responsive design

## 🛠️ Tech Stack

- **React** - Frontend framework
- **Redux** - State management
- **Redux Persist** - State persistence
- **React Router** - Navigation
- **React Bootstrap** - UI components
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **SASS** - Styling
- **React Toastify** - Notifications

## 📁 Project Structure

```
frontend/
├── public/                # Static files
├── src/
│   ├── axios/            # Axios config & interceptors
│   ├── components/        # Reusable components
│   │   ├── commons/       # Common components (Header, Sidebar, etc.)
│   │   ├── RoomDetail/    # Room detail components
│   │   └── RoomList/      # Room list components
│   ├── helper/            # Helper functions
│   ├── pages/             # Page components
│   ├── redux/             # Redux store, actions & reducers
│   ├── services/          # API services
│   └── App.js             # Root component
```

## 📝 Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:

   ```
   REACT_APP_API_URL=http://localhost:8080/api/v1
   REACT_APP_BACKEND_HOST=http://localhost:8080
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## 📜 Available Scripts

- `npm start` - Run development server
- `npm build` - Build production bundle
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🏗️ Main Components

### Pages

- **HomePage** - Landing page with feature overview
- **LoginPage** - User login form
- **RegisterPage** - User registration form
- **RoomListPage** - List of available rooms
- **RoomDetailPage** - Room monitoring and control interface

### Features

- **Room Control** - Control room devices (lights, fans, etc.)
- **Parameter Dashboard** - Real-time sensor data visualization
- **Room History** - Track room usage history
- **Notifications** - Real-time alerts and notifications

## 📊 State Management

Redux store with the following slices:

- **auth** - Authentication state
- **room** - Room data & status
- **notification** - User notifications
