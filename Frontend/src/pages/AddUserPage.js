import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import showToast from "../helper/showToast";
import axiosInstance from "../axios/axios";
import Header from "../components/commons/Header";

const AddUserPage = () => {
  const [username, setUsername] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const fileList = e.target.files;
    const base64Images = [];

    for (let file of fileList) {
      try {
        const base64 = await fileToBase64(file);
        base64Images.push(base64);
      } catch (error) {
        showToast.error("Error processing image");
      }
    }

    setImages(base64Images);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/users", {
        username,
        images,
      });

      showToast.success("User added successfully");
      setUsername("");
      setImages([]);
    } catch (error) {
      showToast.error(error?.response?.data?.message || "Error adding user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container className="py-4 px-5">
        <h2 className="mb-4">Add New User</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add User"}
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default AddUserPage;
