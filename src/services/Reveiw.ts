import { Config } from "src/common";
import { axiosInstance } from "./axiosInstance";

const fetchReivews = async () => {
  const res = await axiosInstance.get(`${Config.SERVER_URL}/review/fetch`, {
    params: {
      page: 1,
      size: 10,
    },
  });

  return res?.data?.data;
};

export default {
  fetchReivews,
};
