import axiosInstance from "../axios/axios";

export const apiService = {
  login: (credentials) =>
    axiosInstance.post("/login", JSON.stringify(credentials)),
  register: (userInfos) =>
    axiosInstance.post("/register", JSON.stringify(userInfos)),
  addRoom: (roomInfos) =>
    axiosInstance.post("/addroom", JSON.stringify(roomInfos)),
  getRooms: () => axiosInstance.get("/rooms"),
  getRoomData: (roomId) =>
    axiosInstance.post("/roomdata", JSON.stringify(roomId)),
  controlDevice: (roomId, device, activity, username) =>
    axiosInstance.post(
      "/room/device",
      JSON.stringify(roomId, device, activity, username)
    ),
  getRoomHistory: (roomId) =>
    axiosInstance.post("/room/history", JSON.stringify({ roomId: roomId })),
  setNotification: (isEnabled, duration = 0) =>
    axiosInstance.post(
      "/room/notification",
      JSON.stringify({ isEnabled: isEnabled, duration: duration })
    ),
};

export default apiService;
