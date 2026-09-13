import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Import Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';

// ==========================================
// NAVIGATION TYPES
// ==========================================

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type AppStackParamList = {
    Home: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

// ==========================================
// STACK COMPONENTS
// ==========================================

const AuthNavigator: React.FC = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
);

const AppNavigator: React.FC = () => (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
        <AppStack.Screen name="Home" component={HomeScreen} />
    </AppStack.Navigator>
);

// ==========================================
// ROOT NAVIGATOR
// ==========================================

const RootNavigator: React.FC = () => {
    const { userToken } = useAuth();

    // Conditional Rendering based on Auth State
    return userToken ? <AppNavigator /> : <AuthNavigator />;
};

export default RootNavigator;