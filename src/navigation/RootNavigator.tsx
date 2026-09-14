import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';

import DoctorListScreen from '../screens/patient/DoctorListScreen';
import DoctorDetailScreen from '../screens/patient/DoctorDetailScreen';

import type {
    AppStackParamList,
    AuthStackParamList,
} from './navigation.types';

// ==========================================
// STACKS
// ==========================================

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

// ==========================================
// AUTH NAVIGATOR
// ==========================================

const AuthNavigator: React.FC = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
};

// ==========================================
// APP NAVIGATOR
// ==========================================

const AppNavigator: React.FC = () => {
    return (
        <AppStack.Navigator screenOptions={{ headerShown: false }}>
            <AppStack.Screen name="Home" component={HomeScreen} />
            <AppStack.Screen name="DoctorList" component={DoctorListScreen} />
            <AppStack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
        </AppStack.Navigator>
    );
};

// ==========================================
// ROOT NAVIGATOR
// ==========================================

const RootNavigator: React.FC = () => {
    const { userToken } = useAuth();

    return userToken ? <AppNavigator /> : <AuthNavigator />;
};

export default RootNavigator;