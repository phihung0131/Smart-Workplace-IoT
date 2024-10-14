import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./LoginPage.scss";
import apiService from "../services/api";
import showToast from "../helper/showToast";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);

  const fetchUsers = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      showToast.success(response?.data?.message);
      console.log(response.data);
    } catch (error) {
      showToast.error(error?.response?.data);
      console.log(">>>Loi: ", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const credentials = { username, password };
    fetchUsers(credentials);
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="login-container">
              <h2 className="text-center mb-4 text-primary">
                Đăng nhập tài khoản
              </h2>
              <p className="text-center text-dark mb-4">
                Vui lòng nhập username và mật khẩu để tiếp tục
              </p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-dark">Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-light"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="text-dark">Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-light"
                  />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Ghi nhớ mật khẩu"
                    checked={rememberPassword}
                    onChange={(e) => setRememberPassword(e.target.checked)}
                    className="text-dark"
                  />
                </div>

                <Button variant="primary" type="submit" className="w-100">
                  Đăng nhập
                </Button>
              </Form>
              <p className="text-center mt-3 text-dark">
                Chưa có tài khoản?
                <Link to="/register" className="text-primary">
                  Tạo tài khoản
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
