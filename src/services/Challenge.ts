import { Config } from "src/common";
import { Challenge } from "src/types/challenge";
import { PaginationResponse } from "src/types/response";
import { axiosInstance } from "./axiosInstance";

interface FetchChallengeParams {
  page: number;
  pageSize?: number;
  sort?: string;
}

const fetchChallenges = async ({
  page,
  pageSize = 10,
  sort = "id,desc",
}: FetchChallengeParams): Promise<PaginationResponse<Challenge[]>> => {
  const res = await axiosInstance.get(`${Config.SERVER_URL}/challenge/list`, {
    params: {
      page,
      size: pageSize,
      sort,
    },
  });

  return res?.data?.data;
};

const addChallenges = async ({
  title,
  categoryId,
  diff,
  term,
  todoList,
}: {
  title: string;
  categoryId: number;
  diff: number;
  term: number;
  todoList: {
    order: number;
    title: string;
  }[];
}): Promise<PaginationResponse<Challenge[]>> => {
  const res = await axiosInstance.post(`${Config.SERVER_URL}/challenge/add`, {
    title,
    categoryId,
    diff,
    term,
    todoList,
  });

  return res?.data?.data;
};

export default {
  fetchChallenges,
  addChallenges,
};
