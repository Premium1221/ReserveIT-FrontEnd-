import axios from 'axios';
import {toast} from "react-toastify";

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

api.interceptors.request.use(
    config => {
        if (config.url === '/auth/refresh') {
            return config;
        }

        const token = sessionStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Adding token to request:', config.url); // Debug log
        } else {
            console.log('No token available for request:', config.url); // Debug log
        }

        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        console.error('API Error:', {
            status: error.response?.status,
            url: originalRequest?.url,
            method: originalRequest?.method,
            error: error.message
        });

        if (error.response?.status === 500) {
            toast.error('Server error. Please try again later.');
            return Promise.reject(error);
        }

        if ((error.response?.status === 401 || error.response?.status === 403) &&
            !originalRequest._retry &&
            originalRequest.url !== '/auth/refresh') {

            originalRequest._retry = true;
            try {
                const response = await api.post('/auth/refresh');
                const { accessToken } = response.data;

                if (accessToken) {
                    sessionStorage.setItem('accessToken', accessToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                sessionStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;