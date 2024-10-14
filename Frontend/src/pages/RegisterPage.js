import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./RegisterPage.scss";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic đăng ký ở đây
    console.log("Đăng ký với:", { name, username, password });
  };

  return (
    <div className="register-page">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="register-container">
              <h2 className="text-center mb-4 text-primary">
                Đăng ký tài khoản
              </h2>
              <p className="text-center text-dark mb-4">
                Vui lòng điền thông tin để tạo tài khoản mới
              </p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label className="text-dark">Tên</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên của bạn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-light"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label className="text-dark">Tên đăng nhập</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Chọn tên đăng nhập"
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

                <Button variant="primary" type="submit" className="w-100">
                  Đăng ký
                </Button>
              </Form>
              <p className="text-center mt-3 text-dark">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-primary">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
