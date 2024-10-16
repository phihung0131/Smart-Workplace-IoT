import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Dashboard from "./Dashboard";
import CircularGauge from "./CircularGauge";
// import apiService from "../../services/api";
import "./Parameter.scss";

const Parameter = (props) => {
  const chartData = props.chartData;

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
