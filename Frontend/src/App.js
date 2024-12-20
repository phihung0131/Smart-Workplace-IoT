import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/commons/Protective";
import RoomListPage from "./pages/RoomListPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import AddUserPage from './pages/AddUserPage';

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <RoomListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room/:id"
            element={
              <ProtectedRoute>
                <RoomDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/add-user" element={<AddUserPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
