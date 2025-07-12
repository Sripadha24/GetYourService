// src/axiosInstance.js

import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:9090', // Spring Boot base URL
});

// Automatically attach JWT token to all requests
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default instance;
