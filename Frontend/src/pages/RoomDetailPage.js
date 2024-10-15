import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Container, Row, Col, Card } from "react-bootstrap";
import apiService from "../services/api";
import Header from "../components/commons/Header";
import Parameter from "../components/RoomDetail/Parameter";
import Sidebar from "../components/commons/Sidebar";
import Control from "../components/RoomDetail/Control";
import "./RoomDetailPage.scss";

const RoomDetailPage = () => {
  const authState = useSelector((state) => state.auth);
  const { id } = useParams();

  const [room, setRoom] = useState({}); // lấy name

  const [isShowParameter, setIsShowParameter] = useState(true);
  const [isShowControl, setIsShowControl] = useState(false);

  const [socket, setSocket] = useState(null);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [light, setLight] = useState(0);

  const [led, setLed] = useState(false);
  const [fan, setFan] = useState(false);
  const [pump, setPump] = useState(false);
  const [automode, setAutomode] = useState(false);

  const updateRoomSensors = useCallback(
    (sensorData) => {
      // console.log(sensorData);
      if (sensorData.sensor.room === id) {
        switch (sensorData.sensor.type) {
          case "light":
            setLight(sensorData.sensor.value);
            break;
          case "temperature":
            setTemperature(sensorData.sensor.value);
            break;
          default:
            setHumidity(sensorData.sensor.value);
        }
      }
    },
    [id]
  ); // `useCallback` đảm bảo hàm không bị tái tạo lại giữa các render trừ khi `id` thay đổi

  const updateRoomDevide = useCallback(
    (deviceData) => {
      if (deviceData.device.room === id) {
        console.log(deviceData);
        switch (deviceData.device.type) {
          case "led":
            setLed(deviceData.device.activity === "ON" ? true : false);
            break;
          case "pump":
            setPump(deviceData.device.activity === "ON" ? true : false);
            break;
          case "fan":
            setFan(deviceData.device.activity === "ON" ? true : false);
            break;
          default:
            setAutomode(deviceData.device.activity === "ON" ? true : false);
        }
      }
    },
    [id]
  );

  useEffect(() => {
    // Kết nối tới server Socket.IO
    const newSocket = io(process.env.REACT_APP_BACKEND_HOST);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected!");
      newSocket.emit("subscribe", { userId: authState.username });
    });

    setSocket(newSocket);

    // Cleanup function
    return () => newSocket.close();
  }, [authState.username]);

  useEffect(() => {
    if (!socket) return;

    // Lắng nghe updates từ server
    socket.on("room-sensors-update", updateRoomSensors);
    socket.on("room-device-update", updateRoomDevide);

    return () => {
      socket.off("room-sensors-update", updateRoomSensors);
      socket.off("room-device-update", updateRoomDevide);
    };
  }, [socket, updateRoomSensors, updateRoomDevide]);

  const handleParameterButton = () => {
    setIsShowParameter(true);
    setIsShowControl(false);
  };

  const handleControlButton = () => {
    setIsShowParameter(false);
    setIsShowControl(true);
  };

  const fetchRoom = async (id) => {
    try {
      const response = await apiService.getRooms();
      const rawData = response?.data?.data;
      const roomData = rawData.filter((room) => {
        return room.roomId._id === id;
      });
      setRoom(roomData[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoomData = async (id) => {
    try {
      await apiService.getRoomData({ roomId: id });
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRoom(id);
    fetchRoomData(id);
  }, [id]);

  return (
    <>
      <Header />

      <div className="room-detail-page min-vh-100 bg-light d-flex">
        <Sidebar
          handleControlButton={handleControlButton}
          handleParameterButton={handleParameterButton}
        />

        <div className="content w-100">
          <Container fluid className="py-4">
            <Card className="room-info shadow-sm">
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <h1 className="room-title">{room?.roomId?.name}</h1>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {isShowParameter && (
              <Parameter
                light={light}
                temperature={temperature}
                humidity={humidity}
              />
            )}
            {isShowControl && (
              <Control
                fan={fan}
                led={led}
                pump={pump}
                automode={automode}
                setAutomode={setAutomode}
                setFan={setFan}
                setLed={setLed}
                setPump={setPump}
              />
            )}
          </Container>
        </div>
      </div>
    </>
  );
};

export default RoomDetailPage;
