import axios from "axios";
import { toast } from "sonner";
import config from "../config";

const API_BASE_URL = `${config.baseUrl}/Auth`;

export const AuthService = {
    login: async (data) => {
        try {
            const userData = await axios.post(`${API_BASE_URL}/login`, {
                email: data.email,
                password: data.password,
            });
            return userData;
        } catch (error) {
            return error.response
        }
    },
    logout: async (accessToken) => {
        try {
            await axios.post(
                `${API_BASE_URL}/logout`,
                {

                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );
        } catch (error) {
            throw new Error(error);
        }
    },

    refresh_token: async (userId, refresh_token) => {
        try {
            const token = await axios.get(`${API_BASE_URL}/refresh_token`, {
                userId,
                refresh_token,
            });
            return token;
        } catch (error) { }
    },
    signup: async (signupData) => {
        try {
            const userEmail = await axios.post(`${API_BASE_URL}/signup`, {
                ...signupData,
            })
            return userEmail;
        } catch (error) {
            throw new Error(error);
        }
    },
};
