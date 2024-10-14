# Lớp EnvironmentController để điều khiển môi trường dựa trên dữ liệu cảm biến
class EnvironmentController:
    def __init__(self, adafruit_client, simulated_sensors):
        self.simulated_sensors = simulated_sensors
        self.adafruit_client = adafruit_client

    def adjust(self):
        # Điều chỉnh môi trường dựa trên dữ liệu cảm biến
        sensor_data = self.simulated_sensors.read_sensors()
        temp = sensor_data['temperature']
        light = sensor_data['light']

        if temp > 28:
            self.control_fan(1)
        elif temp < 22:
            self.control_fan(0)
        if light < 300:
            self.control_led(1)
        elif light > 700:
            self.control_led(0)

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