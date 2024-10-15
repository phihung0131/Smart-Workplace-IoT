import React, { useState } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import Header from "../components/commons/Header";
import RoomTable from "../components/RoomList/RoomTable";
import AddRoomModal from "../components/RoomList/AddRoomModal";

const RoomListPage = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-vh-100 bg-light">
      <Header />
      <Container className="py-4">
        {showAlert && (
          <Alert
            variant="info"
            dismissible
            onClose={() => setShowAlert(false)}
            className="mb-4"
          >
            <Alert.Heading>Chào mừng bạn đến với SmartWork!</Alert.Heading>
            <p className="mb-0">
              Hệ thống quản lý phòng thông minh đã được cập nhật. Khám phá các
              tính năng mới ngay bây giờ.
            </p>
          </Alert>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Danh sách phòng</h2>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <PlusCircle size={16} className="me-2" />
            Thêm phòng mới
          </Button>
        </div>
        <RoomTable />
      </Container>

      <AddRoomModal show={showAddModal} onHide={() => setShowAddModal(false)} />
    </div>
  );
};

export default RoomListPage;






