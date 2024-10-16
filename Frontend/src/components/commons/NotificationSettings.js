import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const NotificationSettings = ({ isEnabled, interval, onSave }) => {
  const [enabled, setEnabled] = useState(isEnabled);
  const [notificationInterval, setNotificationInterval] = useState(interval);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ enabled, interval: notificationInterval });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Check 
          type="switch"
          id="notification-switch"
          label="Bật thông báo"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Thời gian giữa các thông báo (phút)</Form.Label>
        <Form.Control 
          type="number" 
          value={notificationInterval}
          onChange={(e) => setNotificationInterval(e.target.value)}
          disabled={!enabled}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Lưu cài đặt
      </Button>
    </Form>
  );
};

export default NotificationSettings;
