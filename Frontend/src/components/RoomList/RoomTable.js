import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import StatusBadge from "./StatusBadge";
import apiService from "../../services/api";
import "./RoomTable.scss";
import { Link } from "react-router-dom";

const RoomTable = () => {
  const authState = useSelector((state) => state.auth);

  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState([
    {
      id: "NULL",
      name: "NULL",
      adafruitName: "NULL",
      adafruitKey: "NULL",
      status: "NULL",
    },
  ]);

  const fetchRooms = async () => {
    try {
      const response = await apiService.getRooms();
      // Hiển thị thông báo thành công
      // showToast.success(response?.data?.message);
      const rawData = response?.data?.data;
      // console.log(rawData);
      const rooms = rawData.map((room) => {
        let status = "";
        switch (room.roomId.currentUser) {
          case "none":
            status = "Trống";
            break;
          case authState.username:
            status = "Đang sử dụng";
            break;
          default:
            status = "Có người";
        }

        return {
          id: room.roomId._id,
          name: room.roomId.name || "",
          adafruitName: `${"*".repeat(6)}${room.roomId.adaName.slice(-4)}`, // Ẩn tất cả trừ 4 ký tự cuối, giữ tổng cộng 10 ký tự
          adafruitKey: `${"*".repeat(6)}${room.roomId.adaKey.slice(-4)}`, // Tương tự cho adaKey
          status,
        };
      });
      if (rooms.length > 0) {
        setRooms(rooms);
      }
      // console.log(rooms);
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có vấn đề xảy ra
      console.log(error);
      // console.log(">>>Lỗi: ", error);
    }
  };

  const updateRoomStatus = (roomInfos) => {
    const { currentUser, roomId } = roomInfos;
    let status = "";
    switch (currentUser) {
      case "none":
        status = "Trống";
        break;
      case authState.username:
        status = "Đang sử dụng";
        break;
      default:
        status = "Có người";
    }

    setRooms((prevRooms) =>
      prevRooms.map(
        (room) => (room.id === roomId ? { ...room, status } : room) // Cập nhật trạng thái nếu room.id trùng với roomID
      )
    );
  };

  useEffect(() => {
    fetchRooms();

    // Kết nối tới server Socket.IO
    const newSocket = io(process.env.REACT_APP_BACKEND_HOST);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected!");
      // Đăng ký nhận updates khi socket đã kết nối
      newSocket.emit("subscribe", { userId: authState.username });
    });

    setSocket(newSocket);

    // Cleanup function
    return () => newSocket.close();
  }, [authState.username]);

  useEffect(() => {
    if (!socket) return;

    // Lắng nghe updates từ server
    socket.on("room-status-update", updateRoomStatus);

    return () => {
      socket.off("room-status-update", updateRoomStatus);
    };
  }, [socket]);

  // console.log(rooms);
  return (
    <Table hover responsive className="align-middle room-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên phòng</th>
          <th>Adafruit Name</th>
          <th>Adafruit Key</th>
          <th>Trạng thái</th>
          <th>Xem/Điều khiển</th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <tr key={room.id}>
            <td>{room.id}</td>
            <td>{room.name}</td>
            <td>{room.adafruitName}</td>
            <td>{room.adafruitKey}</td>
            <td>
              <StatusBadge status={room.status} />
            </td>
            <td>
              <Link to={"/room/" + room.id}>
                <Button variant="outline-primary" size="sm">
                  Xem
                </Button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default RoomTable;
