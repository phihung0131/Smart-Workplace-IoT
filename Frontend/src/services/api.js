import axiosInstance from "../axios/axios";

export const apiService = {
  login: (credentials) =>
    axiosInstance.post("/login", JSON.stringify(credentials)),
  register: (userInfos) =>
    axiosInstance.post("/register", JSON.stringify(userInfos)),
  addRoom: (roomInfos) =>
    axiosInstance.post("/addroom", JSON.stringify(roomInfos)),
  getRooms: () => axiosInstance.get("/rooms"),
};

export default apiService;
