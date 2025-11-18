import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// 🔥 GUARANTEED FIX: Attach token to ALL requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
