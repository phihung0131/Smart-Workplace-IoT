````markdown
# Smart Work Gateway

This project is a gateway application for a smart work environment, using Python 3.9.x. It is recommended to create a new virtual environment to avoid conflicts.

## Setup Instructions

### 1. Install Dependencies

Run the following command to install all required libraries:

```bash
pip install -r requirements.txt
```
````

### 2. Configure Adafruit IO

Create an Adafruit IO account and update the API key in `modules/config.py`.

### 3. Run the Application

Execute the main script:

```bash
python main2.py
```

### 4. Face Recognition Setup (Optional)

If you want to use face recognition, follow these steps:

1. Create a directory in `known_faces` with your name.
2. Add your photos to this directory.
3. Delete `known_faces_embeddings.pkl` (if it exists).
4. Run the application again.

## Additional Information

- Ensure you are using Python 3.9.x.
- It is recommended to create a new virtual environment to avoid conflicts.

Chức năng chính:
- Điểu khiển thiết bị thông qua Adafruit
- Tính năng tự động điều chỉnh thiết bị
- Điều khiển thiết bị bằng giọng nói
- Nhận dạng và xác minh danh tính người điều khiển
