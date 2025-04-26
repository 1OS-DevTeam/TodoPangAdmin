import axios from "axios";
import Config from "src/common/Config";
import { logout } from "src/utils/auth";

export const axiosInstance = axios.create({
  baseURL: Config.SERVER_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        logout();
      }
    }
    return Promise.reject(error);
  }
);
