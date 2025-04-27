import axios from "axios";
import { Config } from "src/common";
import { axiosInstance } from "./axiosInstance";

const login = async () => {
  const res = await axiosInstance.post(`${Config.SERVER_URL}/auth/login`);

  return res?.data?.data;
};

const logout = async () => {
  const res = await axiosInstance.post(`${Config.SERVER_URL}/auth/logout`);

  return res?.data?.data;
};

export default {
  login,
  logout,
};
