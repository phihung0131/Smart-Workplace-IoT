# Lớp EnvironmentController để điều khiển môi trường dựa trên dữ liệu cảm biến
import time

class EnvironmentController:
    def __init__(self, adafruit_client, simulated_sensors):
        self.simulated_sensors = simulated_sensors
        self.adafruit_client = adafruit_client

    def adjust(self):
        # Điều chỉnh môi trường dựa trên dữ liệu cảm biến
        sensor_data = self.simulated_sensors.get_sensor_data()
        temp = float(sensor_data['temperature'])  # Chuyển đổi sang số thực
        light = float(sensor_data['light'])      # Chuyển đổi sang số thực
        humidity = float(sensor_data['humidity']) # Chuyển đổi sang số thực

        if temp > 27:
            self.control_fan(1)
            time.sleep(0.5)
        elif temp < 22:
            self.control_fan(0)
            time.sleep(0.5)
        if light < 30:
            self.control_led(1)
            time.sleep(0.5)
        elif light > 45:
            self.control_led(0)
            time.sleep(0.5)
        if humidity < 50:
            self.control_pump(1)
            time.sleep(0.5)
        elif humidity > 70:
            self.control_pump(0)
            time.sleep(0.5)

    def control_led(self, state):
        # Điều khiển trạng thái đèn LED
        if state == 1:
            self.adafruit_client.publish('led', 'ON')
        else: 
            self.adafruit_client.publish('led', 'OFF')

    def control_fan(self, state):
        # Điều khiển trạng thái quạt
        if state == 1:
            self.adafruit_client.publish('fan', 'ON')
        else: 
            self.adafruit_client.publish('fan', 'OFF')

    def control_pump(self, state):
        # Điều khiển trạng thái bơm
        if state == 1:
            self.adafruit_client.publish('pump', 'ON')
        else: 
            self.adafruit_client.publish('pump', 'OFF')
