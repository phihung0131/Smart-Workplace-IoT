import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Dashboard from "./Dashboard";
import CircularGauge from "./CircularGauge";
// import apiService from "../../services/api";
import "./Parameter.scss";

const Parameter = (props) => {
  const chartData = [
    { time: "1h", temperature: 20, humidity: 50, light: 65 },
    { time: "2h", temperature: 32, humidity: 55, light: 70 },
    { time: "3h", temperature: 25, humidity: 60, light: 75 },
    { time: "4h", temperature: 28, humidity: 58, light: 72 },
    { time: "5h", temperature: 30, humidity: 52, light: 68 },
    { time: "6h", temperature: 22, humidity: 57, light: 71 },
  ];

  return (
    <Container className="parameter mt-4">
      <Row className="mb-4">
        <Col>
          <Dashboard chartData={chartData} />
        </Col>
      </Row>
      <Row>
        <Col md={4} className="mb-3 mb-md-0">
          <CircularGauge
            value={props.light}
            unit="Lux"
            title="Ánh sáng"
            max={1000}
          />
        </Col>
        <Col md={4} className="mb-3 mb-md-0">
          <CircularGauge
            value={props.temperature}
            unit="Độ C"
            title="Nhiệt độ"
            max={50}
          />
        </Col>
        <Col md={4}>
          <CircularGauge
            value={props.humidity}
            unit="%"
            title="Độ ẩm"
            max={100}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Parameter;
