import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import showToast from "../../helper/showToast";
import apiService from "../../services/api";

const AddRoomModal = ({ show, onHide }) => {
  const [roomData, setRoomData] = useState({
    adaName: "",
    adaKey: "",
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
      adaName: "",
      adaKey: "",
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
            <Form.Label>Adafruit Name</Form.Label>
            <Form.Control
              type="text"
              name="adaName"
              value={roomData.adaName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Adafruit Key</Form.Label>
            <Form.Control
              type="text"
              name="adaKey"
              value={roomData.adaKey}
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
