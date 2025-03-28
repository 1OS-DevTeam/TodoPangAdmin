import axios from "axios";
import { Config } from "src/common";

interface UpdatedCategory {
  updatedCategoryId: number;
  updatedCategoryStatus: number;
  updatedCategoryTitle: string;
}

const fetchCategories = async () => {
  const res = await axios.post(`${Config.SERVER_URL}/admin/category/fetch`, {
    adminId: "user_1",
  });

  return res?.data?.data;
};

const addCategory = async ({ newCategories }: { newCategories: string[] }) => {
  const res = await axios.post(`${Config.SERVER_URL}/admin/category/add`, {
    adminId: "user_1",
    newCategories,
  });

  return res;
};

const updateCategory = async ({
  updatedCategories,
}: {
  updatedCategories: UpdatedCategory[];
}) => {
  const res = await axios.post(`${Config.SERVER_URL}/admin/category/update`, {
    adminId: "user_1",
    updatedCategories,
  });

  return res;
};

export default {
  fetchCategories,
  addCategory,
  updateCategory,
};
