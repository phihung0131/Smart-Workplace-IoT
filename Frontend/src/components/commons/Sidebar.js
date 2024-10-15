import React, { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { FaChartBar, FaSlidersH, FaHistory, FaSignOutAlt, FaBars } from 'react-icons/fa';
import './Sidebar.scss';

const Sidebar = () => {
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
      <Nav className={`sidebar flex-column ${isOpen ? 'open' : ''}`}>
        <Nav.Item>
          <Nav.Link>
            <FaChartBar className="me-2" />
            Thống kê
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>
            <FaSlidersH className="me-2" />
            Điều khiển
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>
            <FaHistory className="me-2" />
            Lịch sử
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>
            <FaSignOutAlt className="me-2" />
            Thoát
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
};

export default Sidebar;