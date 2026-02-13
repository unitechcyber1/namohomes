// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // central error handling possible here
    return Promise.reject(err);
  }
);

export default api;
