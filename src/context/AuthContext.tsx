import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SecureStorage } from '../utils/secure-storage';
import { authEvents } from '../services/auth-events';
import { getToken, getUser, saveToken, saveUser, removeToken, removeUser } from '../utils/auth.storage';

// ==========================================
// INTERFACES
// ==========================================

export interface UserInfo {
    id: string;
    fullName: string;
    email: string;
    role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

interface AuthContextData {
    userToken: string | null;
    userInfo: UserInfo | null;
    isLoading: boolean;
    login: (token: string, user: UserInfo) => Promise<void>;
    logout: () => Promise<void>;
}

// ==========================================
// CONTEXT SETUP
// ==========================================

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Logout Method
    const logout = useCallback(async () => {
        try {
            await removeToken();
            await removeUser();
            // Fallback to SecureStorage helper just in case
            await SecureStorage.removeToken();
            setUserToken(null);
            setUserInfo(null);
        } catch (e) {
            console.error('Failed to clear auth session:', e);
        }
    }, []);

    // Auto-restore session on app startup & Listen for 401 Unauthorized events
    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                const storedToken = await getToken();
                const storedUser = await getUser();

                if (storedToken && storedUser) {
                    setUserToken(storedToken);
                    setUserInfo(storedUser);
                }
            } catch (e) {
                console.error('Failed to restore auth session:', e);
            } finally {
                setIsLoading(false);
            }
        };

        bootstrapAsync();

        // Subscribe to global 401 Unauthorized events from Axios Interceptor
        const unsubscribe = authEvents.subscribe(async () => {
            console.log('[AuthContext] Received UNAUTHORIZED event. Logging out...');
            await logout();
        });

        return () => {
            unsubscribe();
        };
    }, [logout]);

    // Login Method
    const login = useCallback(async (token: string, user: UserInfo) => {
        try {
            await saveToken(token);
            await saveUser(user);
            await SecureStorage.saveToken(token);
            setUserToken(token);
            setUserInfo(user);
        } catch (e) {
            console.error('Failed to save auth session:', e);
            throw new Error('Login failed');
        }
    }, []);

    // Render loading splash while checking SecureStore
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ userToken, userInfo, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook for consuming context safely
export const useAuth = (): AuthContextData => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};