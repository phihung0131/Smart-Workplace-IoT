import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import {
  Navbar,
  Nav,
  Container,
  Badge,
  NavDropdown,
  Modal,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Gear } from "react-bootstrap-icons";
import { logout } from "../../redux/actions/authAction";
import NotificationPanel from "./NotificationPanel";
import NotificationSettings from "./NotificationSettings";
import showToast from "../../helper/showToast";

import "./Header.scss";

const Header = () => {
  const authState = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotification] = useState([]);

  const [isEnabled, setIsEnabled] = useState(true);
  const [duration, setDuration] = useState(15);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Kết nối tới server Socket.IO
    const newSocket = io(process.env.REACT_APP_BACKEND_HOST);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected!");
      newSocket.emit("subscribe", { userId: authState.username + "v2" });
    });

    setSocket(newSocket);

    // Cleanup function
    return () => newSocket.close();
  }, [authState.username]);

  useEffect(() => {
    if (!socket) return;

    // Lắng nghe updates từ server
    socket.on("room-usage-notification", handleNotification);

    return () => {
      socket.off("room-usage-notification", handleNotification);
    };
  }, [socket]);

  const handleNotification = (data) => {
    playNotificationSound();
    showToast.info(data.message);

    let newNoti = {
      content: data.message,
      title: "Thông báo thời gian dùng phòng",
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    setNotification((prev) => [newNoti, ...prev]);
  };

  const playNotificationSound = () => {
    const audio = new Audio("/sound.mp3");

    audio.play().catch((error) => {});
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleAddUserClick = () => {
    navigate("/add-user");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
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
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm sticky-top">
        <Container>
          <Link className="navbar-brand fs-4" to="/">
            SmartWork
          </Link>
          <Nav className="ms-auto d-flex align-items-center">
            <div className="position-relative">
              <Nav.Link
                onClick={toggleNotifications}
                className="position-relative me-3"
              >
                <Bell size={20} className="text-secondary" />
                <Badge bg="danger" className="notification-badge">
                  {notifications.length}
                </Badge>
              </Nav.Link>
              {showNotifications && (
                <div className="notification-dropdown">
                  <NotificationPanel notifications={notifications} />
                </div>
              )}
            </div>
            <Nav.Link onClick={() => setShowSettings(true)} className="me-3">
              <Gear size={20} className="text-secondary" />
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
              <NavDropdown.Item onClick={() => handleAddUserClick()}>
                Thêm dữ liệu khuân mặt
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleLogoutClick()}>
                Đăng xuất
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

      <Modal show={showSettings} onHide={() => setShowSettings(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cài đặt thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NotificationSettings
            isEnabled={isEnabled}
            setIsEnabled={setIsEnabled}
            duration={duration}
            setDuration={setDuration}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;
