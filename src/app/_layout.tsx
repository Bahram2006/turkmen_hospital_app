import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';

/**
 * Inner component that consumes AuthContext to determine routing.
 * Must be separated from RootLayout because Context is provided at the Root level.
 */
const RoutingGuard = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // 1. Show Splash/Loading while verifying tokens on startup
    if (isLoading) {
        return (
            <View style={styles.splashContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    // 2. Redirect based on authentication state
    if (!isAuthenticated) {
        // Unauthenticated users are forced to the login screen
        return <Redirect href="/login" />;
    }

    // 3. Authenticated users see the main app stack
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="appointments" />
            {/* Add other protected routes here */}
        </Stack>
    );
};

/**
 * Root Layout Component
 */
export default function RootLayout() {
    return (
        <AuthProvider>
            <RoutingGuard />
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    splashContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
});