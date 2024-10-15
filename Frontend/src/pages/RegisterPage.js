import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./RegisterPage.scss";
import apiService from "../services/api";
import showToast from "../helper/showToast";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/actions/authAction";
import { Navigate } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const fetchUsers = async (userInfos) => {
    try {
      // Gọi API login
      const response = await apiService.register(userInfos);
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
      showToast.error(error?.response?.data?.data?.error);
      console.log(">>>Lỗi: ", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userInfos = { name, username, password };

    // Gọi hàm fetchUsers để xử lý login
    fetchUsers(userInfos);
  };

  const authState = useSelector((state) => state.auth); // Lấy trạng thái từ redux store

  // Nếu người dùng chưa đăng nhập, điều hướng về trang /login
  if (authState.isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

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
