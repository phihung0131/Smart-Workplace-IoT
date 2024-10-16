import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import './NotificationPanel.scss';

const NotificationPanel = ({ notifications }) => {
  return (
    <div className="notification-panel">
      <Card>
        <Card.Header>Thông báo</Card.Header>
        <ListGroup variant="flush">
          {notifications.map((notification, index) => (
            <ListGroup.Item key={index}>
              <div className="notification-item">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-content">{notification.content}</div>
                <div className="notification-time">{notification.time}</div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
};

export default NotificationPanel;
