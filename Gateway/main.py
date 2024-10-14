from modules.adafruit_client import AdafruitClient
from modules.uart_handler import UARTHandler
from modules.camera_handler import CameraHandler
from modules.pose_detector import PoseDetector
from modules.voice_assistant import VoiceAssistant
from modules.environment_controller import EnvironmentController
from config import CONFIG
import time

class Gateway:
    def __init__(self):
        self.adafruit_client = AdafruitClient(CONFIG)
        self.uart_handler = UARTHandler(CONFIG)
        self.camera_handler = CameraHandler()
        self.pose_detector = PoseDetector(CONFIG['MODEL_PATH'])
        self.voice_assistant = VoiceAssistant()
        self.environment_controller = EnvironmentController(self.uart_handler)
        self.auto_mode = False
        self.work_start_time = None

    def run(self):
        self.adafruit_client.connect()
        while True:
            # Đọc dữ liệu cảm biến
            sensor_data = self.uart_handler.read_sensors()
            self.adafruit_client.publish_sensor_data(sensor_data)

            # Xử lý input từ camera
            frame = self.camera_handler.get_frame()
            if frame is not None:
                presence = self.camera_handler.detect_presence(frame)
                self.adafruit_client.publish('presence', int(presence))

                if presence:
                    pose = self.pose_detector.detect_pose(frame)
                    self.adafruit_client.publish('posture', pose)

                    # Theo dõi thời gian làm việc
                    if self.work_start_time is None:
                        self.work_start_time = time.time()
                else:
                    if self.work_start_time is not None:
                        work_duration = int(time.time() - self.work_start_time)
                        self.adafruit_client.publish('work_duration', work_duration)
                        self.work_start_time = None

            # Xử lý lệnh giọng nói
            command = self.voice_assistant.listen_for_command()
            if command:
                self.process_voice_command(command)

            # Điều chỉnh môi trường nếu chế độ tự động được bật
            if self.auto_mode:
                self.environment_controller.adjust(sensor_data)

            time.sleep(1)

    def process_voice_command(self, command):
        if "bật đèn" in command:
            self.environment_controller.control_led(1)
        elif "tắt đèn" in command:
            self.environment_controller.control_led(0)
        elif "bật quạt" in command:
            self.environment_controller.control_fan(1)
        elif "tắt quạt" in command:
            self.environment_controller.control_fan(0)
        elif "bật chế độ tự động" in command:
            self.auto_mode = True
        elif "tắt chế độ tự động" in command:
            self.auto_mode = False

if __name__ == "__main__":
    gateway = Gateway()
    gateway.run()