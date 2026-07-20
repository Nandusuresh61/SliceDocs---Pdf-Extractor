import { api } from "./api";
import { API_ROUTES } from "../constants/routes";

export const logoutUser = async () => {
    const response = await api.post(API_ROUTES.AUTH.LOGOUT);
    return response.data;
};
