import axios from "axios";

const request = axios.create({
  baseURL: "/apis",
  timeout: 50000,
});

export default request;
