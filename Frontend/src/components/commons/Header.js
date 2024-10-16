import React, { useState, useEffect } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import NotificationPanel from "./NotificationPanel";
import NotificationSettings from "./NotificationSettings";
import { toast } from "react-toastify";
import io from "socket.io-client";
import "./Header.scss";

const Header = () => {
  const authState = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: true,
    interval: 5,
  });
  const [socket, setSocket] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isAuthenticated) {
      const newSocket = io(process.env.REACT_APP_BACKEND_HOST);
      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [authState.isAuthenticated]);

  useEffect(() => {
    if (socket) {
      socket.on("notification", handleNotification);

      return () => {
        socket.off("notification", handleNotification);
      };
    }
  }, [socket]);

  const handleNotification = (data) => {
    if (notificationSettings.enabled) {
      playNotificationSound();
      toast.info(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio("/path/to/notification-sound.mp3");
    audio.play();
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleSaveSettings = (settings) => {
    setNotificationSettings(settings);
    setShowSettings(false);
    // Gửi cài đặt mới đến server
    if (socket) {
      socket.emit("updateNotificationSettings", settings);
    }
  };

  // Mảng thông báo mẫu (sau này có thể lấy từ API hoặc Redux store)
  const notifications = [
    {
      title: "Thông báo 1",
      content: "Nội dung thông báo 1",
      time: "5 phút trước",
    },
    {
      title: "Thông báo 1",
      content: "Nội dung thông báo 1",
      time: "5 phút trước",
    },
    {
      title: "Thông báo 1",
      content: "Nội dung thông báo 1",
      time: "5 phút trước",
    },
    {
      title: "Thông báo 1",
      content: "Nội dung thông báo 1",
      time: "5 phút trước",
    },
    {
      title: "Thông báo 1",
      content: "Nội dung thông báo 1",
      time: "5 phút trước",
    },
    {
      title: "Thông báo 2",
      content: "Nội dung thông báo 2",
      time: "1 giờ trước",
    },
    {
      title: "Thông báo 3",
      content: "Nội dung thông báo 3",
      time: "1 ngày trước",
    },
  ];

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
                  3
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
            isEnabled={notificationSettings.enabled}
            interval={notificationSettings.interval}
            onSave={handleSaveSettings}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;
