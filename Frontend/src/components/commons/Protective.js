import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const authState = useSelector((state) => state.auth); // Lấy trạng thái từ redux store

  // Nếu người dùng chưa đăng nhập, điều hướng về trang /login
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, render children (nội dung trang bảo vệ)
  return children;
};

export default ProtectedRoute;
