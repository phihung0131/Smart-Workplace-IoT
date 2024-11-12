import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import showToast from "../../helper/showToast";
import apiService from "../../services/api";

const AddRoomModal = ({ show, onHide }) => {
  const [roomData, setRoomData] = useState({
    roomId: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchAddRoom = async (roomInfos) => {
    try {
      const response = await apiService.addRoom(roomInfos);
      // Hiển thị thông báo thành công
      showToast.success(response?.data?.message);
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có vấn đề xảy ra
      showToast.error(error?.response?.data?.message);
      // console.log(">>>Lỗi: ", error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý thêm phòng mới ở đây
    console.log("New room data:", roomData);

    fetchAddRoom(roomData);

    setRoomData({
      roomId: "",
      password: "",
    });

    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm phòng mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Room ID</Form.Label>
            <Form.Control
              type="text"
              name="roomId"
              value={roomData.roomId}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={roomData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Thêm phòng
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddRoomModal;
