import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AppointmentsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Full Appointments List Coming Soon</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    text: { color: '#64748B', fontSize: 16 },
});