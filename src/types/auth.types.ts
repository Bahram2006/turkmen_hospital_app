export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean; // True during startup token verification or login/logout transitions
}

export interface LoginCredentials {
    email: string;
    password: string;
}

// Matches your NestJS backend response structure
export interface AuthResponse {
    statusCode: number;
    message: string;
    data: {
        accessToken: string;
        refreshToken?: string;
        user: User;
    };
}