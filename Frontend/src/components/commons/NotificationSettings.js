import React from "react";
import { Form, Button } from "react-bootstrap";
import apiService from "../../services/api";
import showToast from "../../helper/showToast";
const NotificationSettings = ({
  isEnabled,
  setIsEnabled,
  duration,
  setDuration,
}) => {
  const fetchNotificationSettings = async (isEnabled, duration) => {
    try {
      const response = await apiService.setNotification(isEnabled, duration);
      console.log(isEnabled, duration);
      // console.log(response);
      showToast.success(response?.data?.message);
    } catch (error) {
      // console.error(error);
      showToast.error(error?.response?.data?.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchNotificationSettings(isEnabled, duration);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Check
          type="switch"
          id="notification-switch"
          label="Bật thông báo"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Thời gian giữa các thông báo (phút)</Form.Label>
        <Form.Control
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          disabled={!isEnabled}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Lưu cài đặt
      </Button>
    </Form>
  );
};

export default NotificationSettings;
