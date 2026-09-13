import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const HomeScreen: React.FC = () => {
    const { userInfo, logout } = useAuth();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.name}>{userInfo?.fullName}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{userInfo?.role}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.infoText}>Email: {userInfo?.email}</Text>
                <Text style={styles.infoText}>ID: {userInfo?.id}</Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', padding: 24 },
    header: { marginTop: 60, marginBottom: 40 },
    greeting: { fontSize: 16, color: '#64748B', marginBottom: 4 },
    name: { fontSize: 28, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
    roleBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' },
    roleText: { color: '#1D4ED8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
    content: { flex: 1 },
    infoText: { fontSize: 14, color: '#475569', marginBottom: 8, fontFamily: 'monospace' },
    logoutButton: { backgroundColor: '#EF4444', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
    logoutText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default HomeScreen;