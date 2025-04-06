import axios from "axios";
import { Config } from "src/common";

interface Category {
  categoryId: number;
  categoryStatus: 1 | 2 | 3;
  categoryTitle: string;
}

const fetchCategories = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await axios.post(
    `${Config.SERVER_URL}/category/fetch`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res?.data?.data;
};

const addCategory = async ({ newCategories }: { newCategories: string[] }) => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await axios.post(
    `${Config.SERVER_URL}/category/add`,
    {
      newCategories,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res;
};

const updateCategory = async ({
  updatedCategories,
}: {
  updatedCategories: Category[];
}) => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await axios.post(
    `${Config.SERVER_URL}/category/update`,
    {
      updatedCategories,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res;
};

export default {
  fetchCategories,
  addCategory,
  updateCategory,
};
