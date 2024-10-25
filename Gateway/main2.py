from modules.adafruit_client import AdafruitClient
# from modules.simulated_sensors import SimulatedSensors # Sửa => lấy uart
from modules.uart_handler import UARTHandler
# from modules.voice_assistant import VoiceAssistant
from modules.environment_controller2 import EnvironmentController # Sửa => lấy environment_controller
# from modules.camera_handler import CameraHandler
from config import CONFIG
import time
import threading

# Lớp Gateway chính để quản lý toàn bộ hệ thống
class Gateway:
    def __init__(self):
        self.simulated_sensors = UARTHandler()
        # self.simulated_sensors = SimulatedSensors() # data fake
        self.adafruit_client = AdafruitClient(CONFIG, self.simulated_sensors)
        self.environment_controller = EnvironmentController(self.adafruit_client, self.simulated_sensors)
        # self.voice_assistant = VoiceAssistant(CONFIG, self.adafruit_client, self.environment_controller)
        # self.camera_handler = CameraHandler(self.adafruit_client)

    def run_sensor_data(self):
        # Chạy vòng lặp cập nhật dữ liệu cảm biến
        time.sleep(20)

        while True:
            # sensor_data = self.simulated_sensors.read_sensors() #Chạy test data fake
            self.simulated_sensors.read_sensors()
            sensor_data = self.simulated_sensors.get_sensor_data()
            self.adafruit_client.publish_sensor_data(sensor_data)           

            latest_data = self.adafruit_client.get_latest_data()
            # print(latest_data)
            if 'auto_mode' in latest_data and latest_data['auto_mode'] == 'ON':
                self.environment_controller.adjust()

            time.sleep(20)

    # def run_voice_assistant(self):
    #     # Chạy trợ lý giọng nói
    #     time.sleep(20)
    #     while True:
    #         self.voice_assistant.run()

    # def run_camera_handler(self):
    #     # Chạy xử lý camera
    #     time.sleep(20)
    #     self.camera_handler.run()

    def run(self):
        # Khởi chạy toàn bộ hệ thống
        # Kết nối tới Adafruit IO
        self.adafruit_client.connect()

        # Chờ một chút để xem các tin nhắn nhận được (nếu có)
        time.sleep(5)

        # Tạo các luồng cho dữ liệu cảm biến, trợ lý giọng nói và xử lý camera
        thread1 = threading.Thread(target=self.run_sensor_data)
        # thread2 = threading.Thread(target=self.run_voice_assistant)
        # thread3 = threading.Thread(target=self.run_camera_handler)

        # Khởi động các luồng
        thread1.start()
        # thread2.start()
        # thread3.start()

        # Chờ cho tất cả các luồng hoàn thành
        thread1.join()
        # thread2.join() 
        # thread3.join() 

if __name__ == "__main__":
    print("---------------------------")
    gateway = Gateway()
    gateway.run()