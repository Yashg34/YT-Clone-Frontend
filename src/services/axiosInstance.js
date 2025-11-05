import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        console.log(`[Request] ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log(`[Response] ${response.config.method.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(`[Error] ${error.response.config.method.toUpperCase()} ${error.response.config.url} - Status: ${error.response.status}`, error.response.data);

            if (error.response.status === 401) {
                console.warn('Authentication required or token expired. The client should attempt a token refresh or redirect to login.');
            }
        } else if (error.request) {
            console.error('[Error] No response received:', error.request);
        } else {
            console.error('[Error] Request setup failure:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;