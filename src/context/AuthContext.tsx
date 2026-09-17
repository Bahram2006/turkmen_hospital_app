import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { apiClient } from '../services/api';
import { authEvents } from '../services/auth-events';
import { SecureStorage } from '../utils/secure-storage';
import type { AuthState, User, LoginCredentials, AuthResponse } from '../types/auth.types';


// ==========================================
// CONTEXT & REDUCER SETUP
// ==========================================

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
    | { type: 'INIT_START' }
    | { type: 'INIT_SUCCESS'; payload: User }
    | { type: 'INIT_FAILURE' }
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: User }
    | { type: 'LOGOUT' };

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start as true to show splash/loading on app boot
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'INIT_START':
        case 'LOGIN_START':
            return { ...state, isLoading: true };
        case 'INIT_SUCCESS':
        case 'LOGIN_SUCCESS':
            return { user: action.payload, isAuthenticated: true, isLoading: false };
        case 'INIT_FAILURE':
        case 'LOGOUT':
            return { user: null, isAuthenticated: false, isLoading: false };
        default:
            return state;
    }
};

// ==========================================
// PROVIDER COMPONENT
// ==========================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    /**
     * Verifies if a valid token exists on app startup.
     * If yes, fetches the user profile to ensure the token hasn't been revoked.
     */
    const initializeAuth = useCallback(async () => {
        dispatch({ type: 'INIT_START' });
        try {
            const token = await SecureStorage.getToken();

            if (!token) {
                dispatch({ type: 'INIT_FAILURE' });
                return;
            }

            // Verify token validity by fetching current user profile
            // Our Axios interceptor will automatically attach the Bearer token
            const response = await apiClient.get<User>('/auth/me');

            if (response.data.data) {
                dispatch({ type: 'INIT_SUCCESS', payload: response.data.data });
            } else {
                throw new Error('Invalid user data');
            }
        } catch (error) {
            // Token expired or invalid, clear storage
            await SecureStorage.removeToken();
            dispatch({ type: 'INIT_FAILURE' });
        }
    }, []);

    /**
     * Global Logout Handler
     * Triggered manually via UI or automatically via 401 EventEmitter
     */
    const logout = useCallback(async () => {
        try {
            // Optional: Call backend to invalidate refresh token
            // await apiClient.post('/auth/logout');
        } catch (e) {
            // Ignore errors during logout API call
        } finally {
            await SecureStorage.removeToken();
            dispatch({ type: 'LOGOUT' });
        }
    }, []);

    /**
     * Login Handler
     */
    const login = useCallback(async (credentials: LoginCredentials) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const response = await apiClient.post<AuthResponse['data']>('/auth/login', credentials);
            const { accessToken, user } = response.data.data;

            await SecureStorage.saveToken(accessToken);
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } catch (error: any) {
            dispatch({ type: 'INIT_FAILURE' }); // Revert to unauthenticated state
            // Throw error so the UI layer can display the specific message
            throw new Error(error.message || 'Login failed. Please check your credentials.');
        }
    }, []);

    // ==========================================
    // LIFECYCLE & EVENT LISTENERS
    // ==========================================

    useEffect(() => {
        initializeAuth();

        // Subscribe to global 401 Unauthorized events from Axios interceptor
        const unsubscribe = authEvents.subscribe(() => {
            console.warn('[AuthContext] Received 401 event. Forcing logout...');
            logout();
        });

        return () => unsubscribe();
    }, [initializeAuth, logout]);

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};