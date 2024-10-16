const mqtt = require('mqtt');

class AdafruitAdapter {
  constructor(adaName, adaKey) {
    this.client = mqtt.connect('mqtts://io.adafruit.com', {
      username: adaName,
      password: adaKey,
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Kết nối với Adafruit IO thành công');
        resolve();
      });
      this.client.on('error', (error) => {
        console.error('Lỗi kết nối Adafruit IO:', error);
        reject(error);
      });
    });
  }

  publish(feed, value) {
    return new Promise((resolve, reject) => {
      this.client.publish(`${this.client.options.username}/feeds/${feed}`, value.toString(), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  subscribe(feed, callback) {
    const topic = `${this.client.options.username}/feeds/${feed}`;
    this.client.subscribe(topic);
    this.client.on('message', (receivedTopic, message) => {
      if (receivedTopic === topic) {
        callback(message.toString());
      }
    });
  }

  disconnect() {
    return new Promise((resolve) => {
      this.client.end(false, () => {
        console.log('Ngắt kết nối khỏi Adafruit IO');
        resolve();
      });
    });
  }
}

module.exports = AdafruitAdapter;

