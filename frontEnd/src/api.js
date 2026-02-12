// src/api.js

import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL,
});

// This interceptor's only job is to add the current token to outgoing requests.
api.interceptors.request.use(
    config => {
        const authToken = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null;
        if (authToken?.access) {
            config.headers['Authorization'] = `Bearer ${authToken.access}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// This promise is our "lock" to prevent multiple refresh requests at once.
let refreshTokenPromise = null;

// The response interceptor handles 401 errors and token refreshing.
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        const authToken = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null;

        if (authToken?.refresh && error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!refreshTokenPromise) {
                refreshTokenPromise = axios.post(`${baseURL}/api/token/refresh/`, {
                    refresh: authToken.refresh
                }).then(response => {
                    refreshTokenPromise = null;
                    const newAccessToken = response.data.access;
                    const newAuthToken = {
                      refresh : authToken.refresh,
                      access : newAccessToken
                    }
                    localStorage.setItem('authToken', JSON.stringify(newAuthToken));
                    return newAuthToken.access;
                }).catch(err => {
                    refreshTokenPromise = null;
                    console.error("Token refresh failed", err);
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                    return Promise.reject(err);
                });
            }

            try {
                const newAccessToken = await refreshTokenPromise;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
                
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;