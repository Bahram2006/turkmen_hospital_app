import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Physical device (Expo Go) üçin kompyuteriňiziň Wi-Fi IP-sini ýazyň (mysal üçin: http://192.168.1.50:3000)
export const BASE_URL = 'http://localhost:3000';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response Interceptor: Global 401 Handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync('access_token');
        }
        return Promise.reject(error);
    },
);