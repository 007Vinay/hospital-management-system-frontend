import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.1.4:8080",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});
export default api;
