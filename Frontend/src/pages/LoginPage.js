import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./LoginPage.scss";
import apiService from "../services/api";
import showToast from "../helper/showToast";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/actions/authAction";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);

  const fetchUsers = async (credentials) => {
    try {
      // Gọi API login
      const response = await apiService.login(credentials);

      // Hiển thị thông báo thành công
      showToast.success(response?.data?.message);

      // Dispatch login thành công để lưu thông tin người dùng vào Redux store
      dispatch(loginSuccess(response?.data?.data?.user));

      // Đợi 3 giây trước khi chuyển hướng sang trang "/home"
      setTimeout(() => {
        navigate("/home");
      }, 2000); // 3000ms tương đương 3 giây
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có vấn đề xảy ra
      showToast.error(error?.response?.data);
      console.log(">>>Lỗi: ", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const credentials = { username, password };

    // Gọi hàm fetchUsers để xử lý login
    fetchUsers(credentials);
  };

  const authState = useSelector((state) => state.auth); // Lấy trạng thái từ redux store

  // Nếu người dùng chưa đăng nhập, điều hướng về trang /login
  if (authState.isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
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
