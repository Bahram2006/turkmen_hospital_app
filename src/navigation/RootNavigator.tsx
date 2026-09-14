import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Role Router
import HomeScreen from '../screens/main/HomeScreen';

// Patient Flow Screens
import PatientDashboardScreen from '../screens/main/PatientDashboardScreen';
import DoctorListScreen from '../screens/patient/DoctorListScreen';
import DoctorDetailScreen from '../screens/patient/DoctorDetailScreen';
import AppointmentListScreen from '../screens/patient/AppointmentListScreen';
import AppointmentDetailScreen from '../screens/patient/AppointmentDetailScreen';
import BookingScreen from '../screens/patient/BookingScreen';

// Doctor Flow Screens
import DoctorDashboardScreen from '../screens/doctor/DoctorDashboardScreen';
import DoctorAppointmentListScreen from '../screens/doctor/DoctorAppointmentListScreen';

import type {
    AppStackParamList,
    AuthStackParamList,
    PatientStackParamList,
    DoctorStackParamList,
} from './navigation.types';

// ==========================================
// STACKS
// ==========================================

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const PatientStack = createNativeStackNavigator<PatientStackParamList>();
const DoctorStack = createNativeStackNavigator<DoctorStackParamList>();

// ==========================================
// NESTED NAVIGATORS
// ==========================================

const AuthNavigator: React.FC = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
);

const PatientNavigator: React.FC = () => (
    <PatientStack.Navigator screenOptions={{ headerShown: false }}>
        <PatientStack.Screen name="Home" component={PatientDashboardScreen} />
        <PatientStack.Screen name="DoctorList" component={DoctorListScreen} />
        <PatientStack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
        <PatientStack.Screen name="Booking" component={BookingScreen} />
        <PatientStack.Screen name="AppointmentList" component={AppointmentListScreen} />
        <PatientStack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
    </PatientStack.Navigator>
);

const DoctorNavigator: React.FC = () => (
    <DoctorStack.Navigator screenOptions={{ headerShown: false }}>
        <DoctorStack.Screen name="DoctorDashboard" component={DoctorDashboardScreen} />
        <DoctorStack.Screen name="DoctorAppointmentList" component={DoctorAppointmentListScreen} />
    </DoctorStack.Navigator>
);

// ==========================================
// ROLE-BASED ROUTER
// ==========================================

/**
 * Replaces the old HomeScreen logic.
 * Routes directly to the correct nested stack based on JWT role.
 */
const RoleBasedRouter: React.FC = () => {
    const { userInfo } = useAuth();

    if (!userInfo) return null;

    if (userInfo.role === 'DOCTOR') {
        return <DoctorNavigator />;
    }

    // Default to Patient flow for PATIENT and ADMIN roles
    return <PatientNavigator />;
};

// ==========================================
// APP NAVIGATOR
// ==========================================

const AppNavigator: React.FC = () => (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
        <AppStack.Screen name="PatientFlow" component={RoleBasedRouter} />
    </AppStack.Navigator>
);

// ==========================================
// ROOT NAVIGATOR
// ==========================================

const RootNavigator: React.FC = () => {
    const { userToken } = useAuth();

    return userToken ? <AppNavigator /> : <AuthNavigator />;
};

export default RootNavigator;