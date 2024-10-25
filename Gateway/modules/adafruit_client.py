from Adafruit_IO import MQTTClient
import time

# Lớp AdafruitClient để xử lý giao tiếp MQTT với Adafruit IO
class AdafruitClient:
    def __init__(self, config, simulated_sensors):
        # Khởi tạo client MQTT và thiết lập các callback
        self.client = MQTTClient(config['ADAFRUIT_USERNAME'], config['ADAFRUIT_KEY'])
        self.simulated_sensors = simulated_sensors
        self.feed_ids = config['FEED_IDS']
        self.setup_client()
        self.latest_data = {}

    def setup_client(self):
        # Thiết lập các callback cho client MQTT
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect

    def connect(self):
        # Kết nối tới Adafruit IO
        print("Đang kết nối tới Adafruit IO...")
        try:
            self.client.connect()
            self.client.loop_background()
        except Exception as e:
            print(f"Lỗi khi kết nối: {e}")

    def on_connect(self, client):
        # Callback khi kết nối thành công tới Adafruit IO
        print("Đã kết nối tới Adafruit IO")
        
        # Khởi tạo trạng thái các feed
        feed_mode = {
            'fan': 'OFF',
            'led': 'OFF',
            'pump': 'OFF',
            'auto_mode': 'OFF'
        }

        # Đăng ký các feed và publish trạng thái ban đầu
        for feed in feed_mode:
            self.client.subscribe(feed)
            print(f"Đã đăng ký feed: {feed}")
            time.sleep(5)
            self.publish(feed, 'OFF')
        self.publish('user', 'none')           

    def on_message(self, client, feed_id, payload):
        # Callback khi nhận được tin nhắn từ Adafruit IO
        print(f"Nhận được dữ liệu từ {feed_id}: {payload}")
        self.latest_data[feed_id] = payload
        self.simulated_sensors.control_all(self.latest_data)

    def on_disconnect(self, client):
        # Callback khi ngắt kết nối khỏi Adafruit IO
        print("Đã ngắt kết nối khỏi Adafruit IO")

    def publish(self, feed, value):
        # Đăng tải dữ liệu lên feed Adafruit IO
        try:
            self.client.publish(feed, str(value))
            print(f"Đã gửi dữ liệu lên feed {feed}: {value}")
        except Exception as e:
            print(f"Lỗi khi gửi dữ liệu lên feed {feed}: {e}")

    def publish_sensor_data(self, sensor_data):
        # Đăng tải dữ liệu cảm biến lên các feed tương ứng
        for key, value in sensor_data.items():
            if key in self.feed_ids:
                self.publish(key, value)

    def get_latest_data(self):
        # Lấy dữ liệu mới nhất nhận được từ Adafruit IO
        return self.latest_data

# def main():
#     # Cấu hình mẫu
#     config = {
#         'ADAFRUIT_USERNAME': 'phihung0131',
#         'ADAFRUIT_KEY': 'aio_cNgY67a1fv0ie74Hkhzlq1jYJ20R',
#         'FEED_IDS': ['temperature', 'humidity', 'light', 'presence', 'posture', 'work_duration', 'led', 'fan', 'auto_mode']
#     }

#     # simulated_sensors = SimulatedSensors()
#     # Khởi tạo client
#     # client = AdafruitClient(config, simulated_sensors)

#     # # Kết nối tới Adafruit IO
#     # client.connect()

#     # # Chờ một chút để kết nối được thiết lập và nhận dữ liệu
#     # print("Đang đợi dữ liệu từ Adafruit IO...")
#     # time.sleep(5)  # Đợi 30 giây để nhận dữ liệu

#     # # Lấy và in ra dữ liệu mới nhất
#     # latest_data = client.get_latest_data()
#     # print("Dữ liệu mới nhất từ Adafruit IO:")
#     # for feed, value in latest_data.items():
#     #     print(f"{feed}: {value}")

#     # # Gửi dữ liệu mẫu
#     # sample_data = {
#     #     'temperature': 30,
#     #     'humidity': 70,
#     #     'light': 700,
#     #     'presence': 'ddd',
#     #     'posture': 'false',
#     #     'work_duration': 20,
#     #     'led': 'ON',
#     #     'fan': 'ON',
#     #     'auto_mode': 'ON'
#     # }

#     time.sleep(20)
#     # client.publish_sensor_data(sample_data)
#     print(client.get_latest_data())

#     while True:
#         pass
#     print("Kết thúc chương trình")

# if __name__ == "__main__":
#     main()