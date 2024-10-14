import serial
import json

class UARTHandler:
    def __init__(self, config):
        # Khởi tạo kết nối UART
        self.uart = serial.Serial(config['UART_PORT'], config['BAUDRATE'])

    def read_sensors(self):
        # Đọc dữ liệu từ các cảm biến thông qua UART
        self.uart.write(b"READ\n")
        response = self.uart.readline().decode().strip()
        return json.loads(response)

    def control_led(self, state):
        # Điều khiển đèn LED thông qua UART
        command = f"LED,{state}\n"
        self.uart.write(command.encode())

    def control_fan(self, state):
        # Điều khiển quạt thông qua UART
        command = f"FAN,{state}\n"
        self.uart.write(command.encode())