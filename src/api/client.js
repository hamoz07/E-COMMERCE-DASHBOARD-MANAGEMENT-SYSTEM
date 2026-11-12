import axios from "axios";
import { baseURL } from "./endpoints.js";
import Cookie from 'cookie-universal';

const cookie = Cookie();

export const AX = axios.create({
    baseURL: baseURL,
});

// Use an interceptor to inject the token dynamically on every request
AX.interceptors.request.use(
    (config) => {
        const token = cookie.get("user-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);