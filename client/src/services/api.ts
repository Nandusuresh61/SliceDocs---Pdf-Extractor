import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { API_ROUTES } from "../constants/routes";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url === API_ROUTES.AUTH.REFRESH) {
                useAuthStore.getState().logout();
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                await axios.post(
                    `${import.meta.env.VITE_API_URL}${API_ROUTES.AUTH.REFRESH}`,
                    {},
                    { withCredentials: true }
                );

                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);