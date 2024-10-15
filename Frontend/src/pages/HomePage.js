import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.scss";
import Header from "../components/commons/Header";
// import { useSelector } from "react-redux";

const HomePage = () => {
  // const authState = useSelector((state) => state.auth); // Lấy dữ liệu từ Redux store

  return (
    <div className="home-page">
      <div className="bg-light min-vh-100 d-flex flex-column">
        <Header />
        <main className="flex-grow-1">
          <div className="container py-5">
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold">
                Chào mừng bạn đến với SmartWork
              </h1>
              <p className="lead text-muted">
                Cách mạng hóa không gian làm việc của bạn với IoT
              </p>
            </div>

            <div className="card promotion-card text-white mb-5">
              <div className="card-body text-center py-5">
                <h2 className="card-title h3 mb-4">
                  Khuyến mãi mùa Thu: 15-30 tháng 10
                </h2>
                <p className="card-text mb-4">
                  Khám phá các môi trường làm việc hiệu quả và biến đổi không
                  gian làm việc của bạn trong mùa thu này.
                </p>
                <Link to="/register">
                  <button className="btn btn-light btn-lg">
                    Tìm hiểu thêm
                  </button>
                </Link>
              </div>
            </div>

            <div className="row g-4 mb-5">
              {[
                { title: "Chiếu sáng thông minh", icon: "💡" },
                { title: "Kiểm soát khí hậu", icon: "🌡️" },
                { title: "Theo dõi sự hiện diện", icon: "👥" },
                { title: "Quản lý năng lượng", icon: "⚡" },
                { title: "Theo dõi tài sản", icon: "📦" },
                { title: "Đặt phòng họp", icon: "📅" },
              ].map((feature, index) => (
                <div key={index} className="col-md-4">
                  <div className="card h-100 border-0">
                    <div className="card-body text-center">
                      <div className="feature-icon">{feature.icon}</div>
                      <h3 className="card-title h5">{feature.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <footer className="py-4 mt-5">
          <div className="container">
            <div className="row">
              <div className="col-md-6 mb-3 mb-md-0">
                <h5 className="mb-3">SmartWork</h5>
                <p className="mb-0">
                  Chuyển đổi nơi làm việc với công nghệ IoT
                </p>
              </div>
              <div className="col-md-6">
                <ul className="list-unstyled d-flex justify-content-md-end mb-0">
                  <li className="me-3">
                    <Link to="/">Chính sách bảo mật</Link>
                  </li>
                  <li className="me-3">
                    <Link to="/">Điều khoản dịch vụ</Link>
                  </li>
                  <li>
                    <Link to="/">Liên hệ</Link>
                  </li>
                </ul>
              </div>
            </div>
            <hr className="my-4" />
            <div className="text-center">
              <small>&copy; 2024 SmartWork. Bảo lưu mọi quyền.</small>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
