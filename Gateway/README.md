# 🏢 Smart Work Gateway

This project is a gateway application for a smart work environment, built using Python 3.9.x. It is recommended to create a new virtual environment to avoid dependency conflicts.

## 📋 Setup Instructions

### 1. 📦 Install Dependencies

Run the following command to install all required libraries:

```bash
pip install -r requirements.txt
```

### 2. 🔑 Configure Adafruit IO

Create an Adafruit IO account and update the API key in `modules/config.py`.

### 3. 🚀 Run the Application

Execute the main script:

```bash
python main2.py
```

### 4. 🤖 Face Recognition Setup (Optional)

To enable face recognition, follow these steps:

1. Create a folder in `known_faces` with your name.
2. Add your photos to this folder.
3. Delete `known_faces_embeddings.pkl` (if it exists).
4. Run the application again.

## ℹ️ Additional Information

- Make sure you are using Python 3.9.x.
- It's recommended to create a new virtual environment to prevent conflicts.

### ✨ Key Features:

- 🌐 Device control via Adafruit
- ⚙️ Automatic device adjustment features
- 🎤 Voice-controlled device management
- 👤 User identification and verification through face recognition
