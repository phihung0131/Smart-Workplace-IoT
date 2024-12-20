﻿# 🏢 Smart Workplace IoT System

A comprehensive IoT system for smart workplace management, featuring environmental monitoring, voice control, face recognition, and automated device control.

## 🚀 Video Preview

[![Project Demo](https://img.youtube.com/vi/6lYAaqe93vk/0.jpg)](https://youtu.be/6lYAaqe93vk)

## 📂 Project Structure

The project consists of three main components:

### 1. 🌐 Gateway (Python)
- Handles sensor data processing
- Manages face recognition
- Controls voice assistant
- Communicates with Adafruit IO
- Manages device automation

### 2. ⚙️ Backend (Node.js)
- RESTful API server
- Data management
- Business logic implementation
- Device state management

### 3. 🎨 Frontend (React)
- User interface for system control
- Real-time data visualization
- Device status monitoring
- User settings management

## 🛠️ Setup Instructions

### Gateway Setup
1. Install Python 3.9.x
2. Navigate to the Gateway directory
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Adafruit IO credentials in `config.py`
5. Set up face recognition (optional):
   - Create a folder in `known_faces` with the username
   - Add photos to the folder
   - Delete existing `known_faces_embeddings.pkl` if present

### Backend Setup
1. Navigate to the Backend directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the Frontend directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`
4. Start the development server:
   ```bash
   npm start
   ```

## 🌟 Features

### Environmental Monitoring
- 🌡️ Temperature sensing
- 💧 Humidity monitoring
- 💡 Light level detection

### Smart Device Control
- 🎤 Voice command support
- 🛠️ Automated device management
- 📱 Remote control capabilities

### Security
- 👤 Face recognition
- 🚶 User presence detection
- 🔒 Authentication system

### Automation
- ⚙️ Environment optimization
- 📈 Work pattern recognition
- ⏰ Smart device scheduling

## 📋 System Requirements
- Python 3.9.x (Gateway)
- Node.js 14+ (Backend)
- React 17+ (Frontend)
- Compatible IoT sensors and devices
- Webcam for face recognition
- Microphone for voice commands
