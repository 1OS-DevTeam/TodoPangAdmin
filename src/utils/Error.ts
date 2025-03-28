import { Config } from "src/common";

class ResponseError extends Error {
  name;
  code;

  constructor({
    name,
    message,
    code,
  }: {
    name: string;
    message: string;
    code: number | string;
  }) {
    super(message); // (1)
    this.name = name; // (2)
    this.code = code;
  }
}

/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const errorHandler = (e: ResponseError) => {
  if (!Config.isProd) console.error(e);
};

export default ResponseError;
