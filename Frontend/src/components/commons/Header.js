import React, { useState } from "react";
import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Bell } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import "./Header.scss";

const Header = () => {
  const authState = useSelector((state) => state.auth); // Lấy dữ liệu từ Redux store
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    dispatch(logout());
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  if (!authState.isAuthenticated) {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-white ">
        <div className="container">
          <Link className="navbar-brand fs-4" to="/">
            SmartWork
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
          >
            <div className="navbar-nav ms-auto">
              <Link to="/login">
                <button className="btn btn-outline-primary me-2">
                  Đăng nhập
                </button>
              </Link>
              <Link to="/register">
                <button className="btn btn-primary">Đăng ký</button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm sticky-top">
      <Container>
        <Link className="navbar-brand fs-4" to="/">
          SmartWork
        </Link>
        <Nav className="ms-auto d-flex align-items-center">
          <Nav.Link href="#" className="position-relative me-3">
            <Bell size={20} className="text-secondary" />
            <Badge bg="danger" className="notification-badge">
              3
            </Badge>
          </Nav.Link>
          <NavDropdown
            title={
              <div className="d-flex align-items-center">
                <img
                  src="https://pepsilan.com/wp-content/uploads/2022/09/anh-con-vit-cute-8.jpg"
                  alt="Profile"
                  className="profile-image me-2"
                  width="32"
                  height="32"
                />
                <span className="me-1">
                  {authState.name} - {authState.username}
                </span>
              </div>
            }
            id="profile-dropdown"
          >
            <NavDropdown.Item onClick={() => handleLogoutClick()}>
              Đăng xuất
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
