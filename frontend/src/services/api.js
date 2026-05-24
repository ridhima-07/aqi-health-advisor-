import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error(
        error?.response?.data?.message || "API Request Failed"
      );
    }

    return Promise.reject(error);
  }
);

export default api;