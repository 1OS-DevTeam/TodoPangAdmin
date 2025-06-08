import { Config } from "src/common";
import { axiosInstance } from "./axiosInstance";
import {
  AddReview,
  DeployReview,
  Review,
  UpdateReview,
} from "src/types/review";
import { PaginationResponse } from "src/types/response";

const fetchReivews = async (): Promise<PaginationResponse<Review[]>> => {
  const res = await axiosInstance.get(`${Config.SERVER_URL}/review/fetch`, {});

  return res?.data?.data;
};

const addReview = async (review: AddReview) => {
  const res = await axiosInstance.post(
    `${Config.SERVER_URL}/review/add`,
    review
  );

  return res;
};

const updateReview = async (review: UpdateReview) => {
  const res = await axiosInstance.post(
    `${Config.SERVER_URL}/review/update`,
    review
  );

  return res;
};

const deployReview = async (data: DeployReview[]) => {
  const res = await axiosInstance.post(`${Config.SERVER_URL}/review/deploy`, {
    data,
  });

  return res;
};

export default {
  fetchReivews,
  addReview,
  updateReview,
  deployReview,
};
