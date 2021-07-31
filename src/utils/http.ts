import axios, { AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: "https://frontend-challenge.screencloud-michael.now.sh/api",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

const http = {
  post: (url: string, data: unknown): Promise<AxiosResponse> =>
    instance.post(url, data),
};

export default http;
