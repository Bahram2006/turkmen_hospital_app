import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
    const { logout, user } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.email}>{user?.email}</Text>
            <Text style={styles.role}>Role: {user?.role}</Text>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 24 },
    email: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
    role: { fontSize: 14, color: '#64748B', marginBottom: 32 },
    logoutBtn: { backgroundColor: '#EF4444', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 10 },
    logoutText: { color: '#FFFFFF', fontWeight: '700' },
});