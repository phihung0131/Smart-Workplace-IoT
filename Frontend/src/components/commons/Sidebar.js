import React, { useState } from "react";
import { Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaChartBar,
  FaSlidersH,
  FaHistory,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import "./Sidebar.scss";

const Sidebar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <Button
        variant="primary"
        className="d-md-none position-fixed top-0 start-0 m-2 z-3"
        onClick={toggleSidebar}
      >
        <FaBars />
      </Button>
      <Nav className={`sidebar flex-column ${isOpen ? "open" : ""}`}>
        <Nav.Item className="mt-7">
          <Nav.Link
            onClick={() => {
              props.handleParameterButton();
            }}
          >
            <FaChartBar className="me-2" />
            Thống kê
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              props.handleControlButton();
            }}
          >
            <FaSlidersH className="me-2" />
            Điều khiển
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              props.handleHistoryButton();
            }}
          >
            <FaHistory className="me-2" />
            Lịch sử
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>
            <Link to="/home" style={{ textDecoration: "none" }}>
              <FaSignOutAlt className="me-2" />
              Thoát
            </Link>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
};

export default Sidebar;
