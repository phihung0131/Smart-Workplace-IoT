import random

# Lớp SimulatedSensors để mô phỏng dữ liệu cảm biến
class SimulatedSensors:
    def __init__(self):
        self.temperature = 25
        self.humidity = 50
        self.light = 500
        self.led_state = 0
        self.fan_state = 0

    def read_sensors(self):
        # Mô phỏng đọc dữ liệu cảm biến
        self.temperature += random.uniform(-0.5, 0.5)
        self.humidity += random.uniform(-1, 1)
        self.light += random.uniform(-10, 10)

        # return {
        #     'temperature': round(self.temperature, 1),
        #     'humidity': round(self.humidity, 1),
        #     'light': round(self.light, 1)
        # }

        return {
            'temperature': 29,
            'humidity': round(self.humidity, 1),
            'light': 290
        }

    def control_led(self, state):
        # Điều khiển trạng thái LED
        self.led_state = state
        print(f"[MẠCH] Đèn LED đã được {'bật' if state else 'tắt'}")

    def control_fan(self, state):
        # Điều khiển trạng thái quạt
        self.fan_state = state
        print(f"[MẠCH] Quạt đã được {'bật' if state else 'tắt'}")

    def control_all(self, mode_state):
        # Điều khiển tất cả các thiết bị dựa trên trạng thái chế độ
        for key, value in mode_state.items():
            if key == 'led':
                self.control_led(1 if value == 'ON' else 0)
            if key == 'fan':
                self.control_fan(1 if value == 'ON' else 0)
