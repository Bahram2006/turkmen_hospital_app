import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import Constants from 'expo-constants';
import { SecureStorage } from '../utils/secure-storage';
import { authEvents } from './auth-events';

// ==========================================
// TYPES & INTERFACES
// ==========================================

/**
 * Standardized API Response wrapper matching NestJS backend structure
 */
export interface ApiSuccessResponse<T = any> {
    data: T;
    message?: string;
    statusCode: number;
    timestamp?: string;
}

/**
 * Standardized Error Response from NestJS HttpExceptions
 */
export interface ApiErrorResponse {
    statusCode: number;
    message: string | string[];
    error?: string;
    timestamp?: string;
    path?: string;
}

/**
 * Custom typed Axios Error
 */
export type ClinikAxiosError = AxiosError<ApiErrorResponse>;

// ==========================================
// CONFIGURATION
// ==========================================

const getEnvVariable = (key: string): string | undefined => {
    try {
        // @ts-ignore - process.env is injected by Expo/Babel at build time
        return process.env[key];
    } catch (error) {
        return undefined;
    }
};

// Safely extract base URL from Expo Config or environment
const getBaseUrl = (): string => {
    const envUrl = getEnvVariable('EXPO_PUBLIC_API_URL') || Constants.expoConfig?.extra?.apiUrl;

    if (envUrl) {
        return envUrl;
    }

    // Fallback for local development based on platform
    if (__DEV__) {
        // Android emulator requires 10.0.2.2, iOS simulator or web can use localhost
        return 'http://localhost:3000';
    }

    return 'https://api.clinik.com';
};

// ==========================================
// AXIOS INSTANCE
// ==========================================

// 'export' sözüni aýyrdyk, diňe const api boldy
const api: AxiosInstance = axios.create({
    baseURL: getBaseUrl(),
    timeout: 15000, // 15 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// ==========================================
// STATE FOR CONCURRENT 401 HANDLING
// ==========================================

let isHandlingUnauthorized = false;

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        try {
            // Retrieve JWT from SecureStore
            const token = await SecureStorage.getToken();

            // Attach Bearer token if it exists
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Optional: Add device info or custom headers for analytics
            // config.headers['X-Device-Platform'] = Platform.OS;
            // config.headers['X-App-Version'] = Constants.expoConfig?.version;

        } catch (error) {
            console.error('[API Interceptor] Error attaching token:', error);
        }

        return config;
    },
    (error: AxiosError) => {
        // Handle request setup errors
        return Promise.reject(error);
    }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        // Any status code within 2xx triggers this
        return response;
    },
    async (error: AxiosError<ApiErrorResponse>): Promise<any> => {
        // Any status code outside 2xx triggers this

        if (!error.response) {
            // Network error (no internet, DNS failure, CORS, server down)
            console.error('[API Error] Network failure or server unreachable.');
            return Promise.reject({
                message: 'Network error. Please check your internet connection.',
                isNetworkError: true,
            });
        }

        const { status, data } = error.response;

        switch (status) {
            case 401:
                // Unauthorized: Token expired or invalid
                // Prevent multiple simultaneous 401s from triggering multiple logouts
                if (!isHandlingUnauthorized) {
                    isHandlingUnauthorized = true;

                    // TODO: Implement Refresh Token Flow here before logging out
                    // const refreshed = await attemptTokenRefresh();
                    // if (refreshed) { isHandlingUnauthorized = false; return retryOriginalRequest(error.config); }

                    // Clear secure storage
                    await SecureStorage.removeToken();

                    // Broadcast event to AuthContext to update global state & redirect to Login
                    authEvents.emit();

                    isHandlingUnauthorized = false;
                }
                break;

            case 403:
                // Forbidden: Valid token but insufficient permissions
                console.warn('[API Error] Access forbidden.');
                break;

            case 404:
                // Not Found
                console.warn('[API Error] Endpoint not found:', error.config?.url);
                break;

            case 422:
            case 400:
                // Validation Errors (Class-Validator from NestJS)
                // NestJS returns { message: ["email must be an email", ...], error: "Bad Request" }
                console.warn('[API Error] Validation failed:', data?.message);
                break;

            case 429:
                // Rate Limiting
                console.warn('[API Error] Too many requests.');
                break;

            case 500:
            case 502:
            case 503:
                // Server Errors
                console.error('[API Error] Server error:', data?.message);
                break;

            default:
                console.error(`[API Error] Unhandled status code: ${status}`);
        }

        // Normalize the error object for easier consumption in UI layers
        const normalizedError = {
            status,
            message: Array.isArray(data?.message) ? data.message.join(', ') : (data?.message || 'An unexpected error occurred'),
            errors: Array.isArray(data?.message) ? data.message : undefined,
            originalError: error,
        };

        return Promise.reject(normalizedError);
    }
);

// ==========================================
// TYPED API HELPER METHODS (Optional but recommended)
// ==========================================

/**
 * Wrapper functions to enforce strict typing on API calls
 */
export const apiClient = {
    get: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiSuccessResponse<T>>> =>
        api.get<ApiSuccessResponse<T>>(url, config),

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiSuccessResponse<T>>> =>
        api.post<ApiSuccessResponse<T>>(url, data, config),

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiSuccessResponse<T>>> =>
        api.put<ApiSuccessResponse<T>>(url, data, config),

    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiSuccessResponse<T>>> =>
        api.patch<ApiSuccessResponse<T>>(url, data, config),

    delete: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiSuccessResponse<T>>> =>
        api.delete<ApiSuccessResponse<T>>(url, config),
};

export default api;