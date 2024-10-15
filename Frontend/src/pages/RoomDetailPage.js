import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Header from "../components/commons/Header";
import Parameter from "../components/RoomDetail/Parameter";
import Sidebar from "../components/commons/Sidebar";
import "./RoomDetailPage.scss";

const RoomDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="room-detail-page min-vh-100 bg-light d-flex">
      <Sidebar />
      <div className="content w-100">
        <Header />
        <Container fluid className="py-4">
          <Card className="room-info mb-4 shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <h1 className="room-title mb-0">ROOM {id}</h1>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Parameter />
        </Container>
      </div>
    </div>
  );
};

export default RoomDetailPage;
