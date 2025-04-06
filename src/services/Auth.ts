import axios from "axios";
import { Config } from "src/common";

const login = async (accessToken: string) => {
  const res = await axios.post(
    `${Config.SERVER_URL}/auth/login`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res?.data?.data;
};

const logout = async (accessToken: string) => {
  const res = await axios.post(
    `${Config.SERVER_URL}/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res?.data?.data;
};

export default {
  login,
  logout,
};
