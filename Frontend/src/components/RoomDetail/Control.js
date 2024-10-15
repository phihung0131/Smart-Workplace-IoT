import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaFan, FaLightbulb, FaSprayCan, FaCog } from "react-icons/fa";
import apiService from "../../services/api";
import "./Control.scss";

const ControlItem = (props) => {
  const { id } = useParams();
  const toggleState = async () => {
    let device, activity;
    switch (props.label) {
      case "Quạt":
        device = "fan";
        break;
      case "Đèn":
        device = "led";
        break;
      case "Máy tạo ẩm":
        device = "pump";
        break;
      default:
        device = "auto_mode";
    }

    if (props.isOn) {
      activity = "OFF";
    } else {
      activity = "ON";
    }
    try {
      await apiService.controlDevice({ roomId: id, device, activity });
    } catch (error) {
      console.error(">>>>>Loi:", error);
    }
    // setState(!props.isOn);
  };

  return (
    <Card className={`control-item ${props.isOn ? "on" : "off"}`}>
      <Card.Body>
        <div className="icon-wrapper">
          {React.createElement(props.icon, { size: 40 })}
        </div>
        <Card.Title>{props.label}</Card.Title>
        <div className="d-flex justify-content-between mt-3">
          <Button
            variant={props.isOn ? "primary" : "light"}
            className={props.isOn ? "active" : ""}
            onClick={toggleState}
          >
            Bật
          </Button>
          <Button
            variant={!props.isOn ? "danger" : "light"}
            className={!props.isOn ? "active" : ""}
            onClick={toggleState}
          >
            Tắt
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

const Control = (props) => {
  return (
    <Container className="smart-home-controls">
      <Row className="g-4">
        <Col xs={12} sm={6}>
          <ControlItem
            icon={FaFan}
            label="Quạt"
            isOn={props.fan}
            setState={props.setFan}
          />
        </Col>
        <Col xs={12} sm={6}>
          <ControlItem
            icon={FaLightbulb}
            label="Đèn"
            isOn={props.led}
            setState={props.setLed}
          />
        </Col>
        <Col xs={12} sm={6}>
          <ControlItem
            icon={FaSprayCan}
            label="Máy tạo ẩm"
            isOn={props.pump}
            setState={props.setPump}
          />
        </Col>
        <Col xs={12} sm={6}>
          <ControlItem
            icon={FaCog}
            label="Chế độ tự động"
            isOn={props.automode}
            setState={props.setAutomode}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Control;
