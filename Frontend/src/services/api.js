import axiosInstance from "../axios/axios";

export const apiService = {
  login: (credentials) =>
    axiosInstance.post("/login", JSON.stringify(credentials)),
  register: (userInfos) => axiosInstance.post("/register", userInfos),

  // Thêm các phương thức API khác tại đây
};

export default apiService;
