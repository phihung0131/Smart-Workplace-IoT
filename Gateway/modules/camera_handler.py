import cv2
import torch
import numpy as np
from facenet_pytorch import MTCNN, InceptionResnetV1
from PIL import Image
import os
import time
from datetime import datetime
import pickle

# Lớp CameraHandler để xử lý nhận diện khuôn mặt và phát hiện sự hiện diện
class CameraHandler:
    def __init__(self, adafruit_client):
        self.adafruit_client = adafruit_client
        
        # Khởi tạo camera và các mô hình AI
        self.camera = cv2.VideoCapture(0)
        self.model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
        self.mtcnn = MTCNN(image_size=160, margin=0, min_face_size=20,
                           thresholds=[0.6, 0.7, 0.7], factor=0.709, post_process=True,
                           device='cuda' if torch.cuda.is_available() else 'cpu')
        self.resnet = InceptionResnetV1(pretrained='vggface2').eval()
        
        # Tải các embedding khuôn mặt đã biết
        self.known_embeddings = {}
        self.load_known_faces()

        # Các biến quản lý người điều khiển
        self.current_controller = None
        self.last_detection_time = None
        self.control_start_time = None

    def load_known_faces(self):
        # Tải các embedding khuôn mặt đã biết từ file hoặc tính toán chúng
        self.known_embeddings = {}  # Clear existing embeddings
        serialized_file = 'known_faces_embeddings.pkl'
        if os.path.exists(serialized_file):
            print("Đang tải dữ liệu khuôn mặt đã serialized...")
            with open(serialized_file, 'rb') as f:
                self.known_embeddings = pickle.load(f)
            print(f"Đã tải {len(self.known_embeddings)} khuôn mặt từ file serialized.")
            return

        # Nếu file serialized không tồn tại, tính toán embedding từ ảnh
        known_faces_dir = 'known_faces'
        if not os.path.exists(known_faces_dir):
            print(f"Thư mục '{known_faces_dir}' không tồn tại. Tạo thư mục này và thêm ảnh trước khi chạy.")
            print("Mỗi người nên có một thư mục riêng chứa ảnh của họ trong thư mục 'known_faces'.")
            return

        print("Đang tính toán embeddings cho khuôn mặt...")
        for person in os.listdir(known_faces_dir):
            person_dir = os.path.join(known_faces_dir, person)
            if os.path.isdir(person_dir):
                for img_name in os.listdir(person_dir):
                    img_path = os.path.join(person_dir, img_name)
                    img = Image.open(img_path).convert('RGB')
                    img = np.array(img)
                    face = self.mtcnn(img)
                    if face is not None:
                        face = face.unsqueeze(0)  # Thêm chiều batch
                        embedding = self.resnet(face).detach()
                        if person not in self.known_embeddings:
                            self.known_embeddings[person] = []
                        self.known_embeddings[person].append(embedding)

        if not self.known_embeddings:
            print("Không tìm thấy ảnh khuôn mặt nào trong thư mục 'known_faces'.")
            print("Hãy thêm ảnh vào các thư mục con tương ứng với mỗi người.")
        else:
            print(f"Đã tải và tính toán embeddings cho {len(self.known_embeddings)} khuôn mặt.")
            
        # Serialize embeddings
        with open(serialized_file, 'wb') as f:
            pickle.dump(self.known_embeddings, f)
        print(f"Đã lưu embeddings vào file {serialized_file}")

    def get_frame(self):
        # Chụp một frame từ camera
        ret, frame = self.camera.read()
        return frame if ret else None

    def detect_presence(self, image):
        # Phát hiện sự hiện diện của con người trong ảnh sử dụng YOLOv5
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.model(image_rgb)
        detections = results.xyxy[0] if hasattr(results, 'xyxy') else results[0]
        detections = detections.cpu().numpy()
        
        for detection in detections:
            if len(detection) >= 6 and int(detection[5]) == 0:  # Lớp 0 thường là 'person' trong dataset COCO
                return True
        return False

    def recognize_face(self, image):
        # Nhận diện khuôn mặt trong ảnh
        if len(image.shape) == 2:
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        elif image.shape[2] == 4:
            image = cv2.cvtColor(image, cv2.COLOR_BGRA2RGB)
        
        face = self.mtcnn(image)
        
        if face is not None:
            face = face.unsqueeze(0)  # Thêm chiều batch
            embedding = self.resnet(face).detach()
            
            min_dist = float('inf')
            identity = "Unknown"
            for name, known_embeddings in self.known_embeddings.items():
                for known_embedding in known_embeddings:
                    dist = torch.dist(embedding, known_embedding).item()
                    if dist < min_dist:
                        min_dist = dist
                        identity = name
            
            if min_dist > 0.6:
                identity = "Unknown"
            
            return identity
        
        return None

    def update_controller(self, identity):
        # Cập nhật người điều khiển hiện tại dựa trên nhận diện khuôn mặt
        current_time = time.time()
        
        if identity and identity != "Unknown":
            if self.current_controller != identity:
                self.current_controller = identity
                self.control_start_time = current_time
                text = f"Quyền điều khiển được gán cho {identity} lúc {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
                print(text)
                self.adafruit_client.publish('user', text) 

            self.last_detection_time = current_time
        elif self.current_controller and (current_time - self.last_detection_time > 20):
            text = f"Thu hồi quyền điều khiển từ {self.current_controller} lúc {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            print(text)
            self.adafruit_client.publish('user', text) 
            time.sleep(2)
            self.adafruit_client.publish('user', 'none') 

            self.current_controller = None
            self.control_start_time = None

    def run(self):
        # Vòng lặp chính cho xử lý camera và nhận diện khuôn mặt
        if not self.known_embeddings:
            print("Không có dữ liệu khuôn mặt. Chương trình sẽ chỉ phát hiện sự hiện diện của người.")

        while True:
            frame = self.get_frame()
            if frame is None:
                print("Không thể lấy frame từ camera.")
                break
            
            presence = self.detect_presence(frame)
            
            if presence:
                if self.known_embeddings:
                    identity = self.recognize_face(frame)
                    self.update_controller(identity)
                    
                    if self.current_controller:
                        cv2.putText(frame, f"Nguoi dieu khien: {self.current_controller}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    else:
                        cv2.putText(frame, "Dang xac minh danh tinh", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
                else:
                    cv2.putText(frame, "Co nguoi, khong co du lieu nhan dang", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            else:
                cv2.putText(frame, "Khong co nguoi", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                self.update_controller(None)
            
            cv2.imshow('Camera Feed', frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        self.camera.release()
        cv2.destroyAllWindows()

# if __name__ == "__main__":
#     handler = CameraHandler()
#     handler.run()