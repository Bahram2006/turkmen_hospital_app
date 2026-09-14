import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import DoctorDashboardScreen from './DoctorDashboardScreen';
import PatientDashboardScreen from './PatientDashboardScreen';

const HomeScreen: React.FC = () => {
    const { userInfo, logout } = useAuth();

    if (!userInfo) {
        return (
            <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackTitle}>Session Expired</Text>

                <Text style={styles.fallbackSubtitle}>
                    We could not load your profile. Please log in again.
                </Text>

                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutButtonText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (userInfo.role === 'DOCTOR') {
        return <DoctorDashboardScreen />;
    }

    if (userInfo.role === 'PATIENT') {
        return <PatientDashboardScreen />;
    }

    return (
        <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackTitle}>Admin Dashboard</Text>

            <Text style={styles.fallbackSubtitle}>
                Admin dashboard will be implemented in a later phase.
            </Text>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    fallbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 24,
    },
    fallbackTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 8,
        textAlign: 'center',
    },
    fallbackSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 24,
    },
    logoutButton: {
        backgroundColor: '#EF4444',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default HomeScreen;