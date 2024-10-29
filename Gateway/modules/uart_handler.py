import serial.tools.list_ports
import json
import time

def getPort():
    ports = serial.tools.list_ports.comports()
    N = len ( ports )
    commPort = None
    for i in range (0 , N) :
        port = ports [i]
        strPort = str(port)
        if "USB-SERIAL" in strPort:
            splitPort = strPort.split (" ")
            commPort = (splitPort[0])
    return commPort

class UARTHandler:
    def __init__(self):
        self.temperature = 0
        self.humidity = 0
        self.light = 0
        self.led_state = 0
        self.fan_state = 0
        self.pump_state = 0
        self.message = ""
        # Thêm xử lý nếu không tìm thấy cổng COM
        port = getPort()
        if port is None:
            raise Exception("Không tìm thấy cổng COM phù hợp!")
        
        self.uart = serial.Serial(
            port=port,
            baudrate=115200,
            timeout=1
        )
        print(f'UART connected on {port}!')

    def process_data(self, data):
        data = data[1:-1]
        data_from_sensor = json.loads(data)
        self.temperature = data_from_sensor['temperature']
        self.light = data_from_sensor['light']
        self.humidity = data_from_sensor['humidity']
        # print(f"Temperature: {self.temperature}, Humidity: {self.humidity}, Light: {self.light}")

    def read_sensors(self):
        bytesToRead = self.uart.inWaiting()
        if (bytesToRead > 0):
            self.message = self.message + self.uart.read(bytesToRead).decode("UTF-8")
            while('!' in self.message and '#' in self.message):
                start = self.message.find('!')
                end = self.message.find('#')
                # print(self.message[start:end+1])
                self.process_data(self.message[start:end+1])
                self.message = self.message[end+1:]

    def get_sensor_data(self):
        return {
            'temperature': self.temperature,
            'humidity': self.humidity,
            'light': self.light
        }
    
    def control_led(self, state):
        # Điều khiển trạng thái LED
        self.led_state = state
        print(f"[MẠCH] Đèn LED đã được {'bật' if state else 'tắt'}")
        # Điều khiển đèn LED thông qua UART
        command = f"L{state}" #L1 => Bật đèn, L0 => Tắt đèn
        self.uart.write(command.encode())

    def control_fan(self, state):
        # Điều khiển trạng thái quạt
        self.fan_state = state
        print(f"[MẠCH] Quạt đã được {'bật' if state else 'tắt'}")
        # Điều khiển quạt thông qua UART
        command = f"F{state}" #F1 => Bật quạt, F0 => Tắt quạt
        self.uart.write(command.encode())

    def control_pump(self, state):
        # Điều khiển trạng thái bơm nước
        self.pump_state = state
        print(f"[MẠCH] Bơm nước đã được {'bật' if state else 'tắt'}")
        # Điều khiển bơm nước thông qua UART
        command = f"P{state}" #P1 => Bật bơm, P0 => Tắt bơm
        self.uart.write(command.encode())

    # def control_all(self, mode_state):
    #     # Điều khiển tất cả các thiết bị dựa trên trạng thái chế độ
    #     for key, value in mode_state.items():
    #         if key == 'led':
    #             self.control_led(1 if value == 'ON' else 0)
    #         if key == 'fan':
    #             self.control_fan(1 if value == 'ON' else 0)
    #         if key == 'pump':
    #             self.control_pump(1 if value == 'ON' else 0)
    


        
if __name__ == "__main__":
    print("---------------------------")
    uart = UARTHandler()
    # uart.control_led(0)
    # time.sleep(2)

#     last_led_state = {'pump': 'OFF', 'fan': 'OFF', 'auto_mode': 'OFF', 'led': 'ON'}
#     uart.control_all(last_led_state)
    while True :
        uart.read_sensors()
        time.sleep(5)

