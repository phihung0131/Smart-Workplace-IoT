class EnvironmentController:
    def __init__(self, uart_handler):
        self.uart_handler = uart_handler

    def adjust(self, sensor_data):
        # Điều chỉnh môi trường dựa trên dữ liệu cảm biến
        temp = sensor_data['temperature']
        light = sensor_data['light']

        if temp > 28:
            self.control_fan(3)
        elif temp > 25:
            self.control_fan(2)
        elif temp > 22:
            self.control_fan(1)
        else:
            self.control_fan(0)

        if light < 50:
            self.control_led(3)
        elif light < 100:
            self.control_led(2)
        elif light < 200:
            self.control_led(1)
        else:
            self.control_led(0)

    def control_led(self, state):
        # Điều khiển đèn LED thông qua UART handler
        self.uart_handler.control_led(state)

    def control_fan(self, state):
        # Điều khiển quạt thông qua UART handler
        self.uart_handler.control_fan(state)
