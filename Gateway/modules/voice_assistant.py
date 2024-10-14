import struct
import pyaudio
import pvporcupine
import speech_recognition as sr
import pyttsx3
from gtts import gTTS
import pygame
import os
import threading

# Lớp VoiceAssistant để xử lý các lệnh giọng nói
class VoiceAssistant:
    def __init__(self, config, adafruit_client, environment_controller):
        self.environment_controller = environment_controller
        self.adafruit_client = adafruit_client
        self.access_key = config['ACCESS_KEY_PICOVOICE']
        self.porcupine = None
        self.pa = None
        self.audio_stream = None
        
        self.recognizer = sr.Recognizer()
        self.tts_engine = pyttsx3.init()

    def initialize_porcupine(self):
        # Khởi tạo Porcupine để nhận diện từ khóa đánh thức
        self.porcupine = pvporcupine.create(access_key=self.access_key, keywords=["hey google"])
        self.pa = pyaudio.PyAudio()
        self.audio_stream = self.pa.open(
            rate=self.porcupine.sample_rate,
            channels=1,
            format=pyaudio.paInt16,
            input=True,
            frames_per_buffer=self.porcupine.frame_length)

    def listen_for_wake_word(self):
        # Lắng nghe từ khóa đánh thức
        print("Đang lắng nghe 'Hey Google'...")
        while True:
            pcm = struct.unpack_from("h" * self.porcupine.frame_length,
                                     self.audio_stream.read(self.porcupine.frame_length))
            keyword_index = self.porcupine.process(pcm)
            if keyword_index >= 0:
                print("Đã phát hiện từ khóa đánh thức!")
                return True

    def listen_for_command(self):
        # Lắng nghe lệnh sau khi phát hiện từ khóa đánh thức
        with sr.Microphone() as source:
            print("Đang lắng nghe lệnh...")
            self.recognizer.adjust_for_ambient_noise(source)
            audio = self.recognizer.listen(source, timeout=10, phrase_time_limit=5)
            try:
                command = self.recognizer.recognize_google(audio, language="vi-VN").lower()
                return command
            except sr.UnknownValueError:
                print("Không hiểu được lệnh")
            except sr.RequestError:
                print("Không thể yêu cầu kết quả từ dịch vụ nhận dạng giọng nói")
        return None

    def speak(self, text):
        # Chuyển văn bản thành giọng nói
        try:
            tts = gTTS(text=text, lang='vi')
            filename = "output.mp3"
            tts.save(filename)
            
            def play_sound():
                try:
                    pygame.mixer.init()
                    pygame.mixer.music.load(filename)
                    pygame.mixer.music.play()
                    while pygame.mixer.music.get_busy():
                        pygame.time.Clock().tick(10)
                finally:
                    pygame.mixer.quit()
            
            threading.Thread(target=play_sound).start()
        except Exception as e:
            print(f"Lỗi khi phát âm thanh: {e}")
            print(f"Văn bản lẽ ra phải được đọc: {text}")

    def process_voice_command(self, command):
        # Xử lý lệnh giọng nói
        if "bật đèn" in command:
            self.environment_controller.control_led(1)
            return "Đã bật đèn"
        elif "tắt đèn" in command:
            self.environment_controller.control_led(0)
            return "Đã tắt đèn"
        elif "bật quạt" in command:
            self.environment_controller.control_fan(1)
            return "Đã bật quạt"
        elif "tắt quạt" in command:
            self.environment_controller.control_fan(0)
            return "Đã tắt quạt"
        elif "bật chế độ tự động" in command:
            self.adafruit_client.publish('auto_mode', 'ON')
            return "Đã bật chế độ tự động"
        elif "tắt chế độ tự động" in command:
            self.adafruit_client.publish('auto_mode', 'OFF')
            return "Đã tắt chế độ tự động"
        else:
            return "Không hiểu lệnh"

    def cleanup(self):
        # Dọn dẹp tài nguyên
        if self.audio_stream is not None:
            self.audio_stream.close()
        if self.pa is not None:
            self.pa.terminate()
        if self.porcupine is not None:
            self.porcupine.delete()

    def run(self):
        # Chạy trợ lý giọng nói
        self.initialize_porcupine()

        print("Đang kiểm tra Trợ lý Giọng nói...")
        print("Hãy nói 'Hey Google' để kích hoạt, sau đó đưa ra lệnh.")

        try:
            while True:
                if self.listen_for_wake_word():
                    self.speak("Tôi có thể giúp gì cho bạn?")
                    command = self.listen_for_command()
                    if command:
                        print(f"Lệnh: {command} ...")
                        result = self.process_voice_command(command)
                        print(f"Kết quả: {result}")
                        self.speak(result)
        finally:
            self.cleanup()

# if __name__ == "__main__":
#     test_improved_voice_assistant()