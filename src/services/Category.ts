import { Config } from "src/common";
import { axiosInstance } from "./axiosInstance";

interface Category {
  categoryId: number;
  categoryStatus: 1 | 2 | 3;
  categoryTitle: string;
}

const fetchCategories = async () => {
  const res = await axiosInstance.post(`${Config.SERVER_URL}/category/fetch`);

  return res?.data?.data;
};

const addCategory = async ({ newCategories }: { newCategories: string[] }) => {
  const res = await axiosInstance.post(`${Config.SERVER_URL}/category/add`, {
    newCategories,
  });

  return res;
};

const updateCategory = async ({
  updatedCategories,
}: {
  updatedCategories: Category[];
}) => {
  const res = await axiosInstance.post(`${Config.SERVER_URL}/category/update`, {
    updatedCategories,
  });

  return res;
};

export default {
  fetchCategories,
  addCategory,
  updateCategory,
};
