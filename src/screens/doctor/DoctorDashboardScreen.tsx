import React, { useState, useMemo } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { DoctorDashboardScreenProps } from '../../navigation/navigation.types';
import { MOCK_APPOINTMENTS } from '../../data/mockAppointments';
import { useAppointments } from '../../context/AppointmentContext';
import { useAuth } from '../../context/AuthContext';

// ==========================================
// COMPONENT
// ==========================================

const DoctorDashboardScreen: React.FC<DoctorDashboardScreenProps> = ({
    navigation,
}) => {
    const [isAvailable, setIsAvailable] = useState<boolean>(true);
    const { userInfo } = useAuth();
    const { getDoctorAppointments } = useAppointments();

    // Calculate stats based on mock data (simulating real-time state)
    const stats = useMemo(() => {
        if (!userInfo) return { totalToday: 0, pendingRequests: 0, completedConsultations: 0 };

        const myAppts = getDoctorAppointments(userInfo.id);
        const todayStr = new Date().toISOString().split('T')[0];

        return {
            totalToday: myAppts.filter(a => a.appointmentDate.startsWith(todayStr) && a.status === 'CONFIRMED').length,
            pendingRequests: myAppts.filter(a => a.status === 'PENDING').length,
            completedConsultations: myAppts.filter(a => a.status === 'COMPLETED').length,
        };
    }, [getDoctorAppointments, userInfo]);

    const handleToggleAvailability = (value: boolean): void => {
        // TODO: Call API to update doctor availability in DB
        setIsAvailable(value);
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome back,</Text>
                        <Text style={styles.name}>Dr. Sarah Jenkins</Text>
                        <Text style={styles.specialty}>Cardiology</Text>
                    </View>

                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>SJ</Text>
                    </View>
                </View>

                {/* Availability Card */}
                <View style={[styles.card, styles.availabilityCard]}>
                    <View style={styles.availabilityInfo}>
                        <Text style={styles.availabilityTitle}>Consultation Status</Text>
                        <Text style={styles.availabilitySubtitle}>
                            {isAvailable ? 'You are currently accepting patients.' : 'You are currently offline.'}
                        </Text>
                    </View>

                    <Switch
                        trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                        thumbColor={isAvailable ? '#2563EB' : '#F8FAFC'}
                        ios_backgroundColor="#CBD5E1"
                        onValueChange={handleToggleAvailability}
                        value={isAvailable}
                    />
                </View>

                {/* Today's Summary Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Today&apos;s Schedule</Text>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>{stats.totalToday}</Text>
                            <Text style={styles.summaryLabel}>Appointments</Text>
                        </View>

                        <View style={styles.dividerVertical} />

                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>
                                {stats.pendingRequests}
                            </Text>
                            <Text style={styles.summaryLabel}>Pending Requests</Text>
                        </View>
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            styles.viewScheduleButton,
                            pressed ? styles.buttonPressed : undefined,
                        ]}
                        onPress={() => navigation.navigate('DoctorAppointmentList')}
                    >
                        <Text style={styles.viewScheduleButtonText}>
                            Manage Appointments
                        </Text>
                    </Pressable>
                </View>

                {/* Quick Stats Grid */}
                <Text style={styles.sectionTitle}>Overview</Text>

                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>👥</Text>
                        <Text style={styles.statValue}>142</Text>
                        <Text style={styles.statLabel}>Total Patients</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>✅</Text>
                        <Text style={styles.statValue}>{stats.completedConsultations}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>⭐</Text>
                        <Text style={styles.statValue}>4.9</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>💰</Text>
                        <Text style={styles.statValue}>$2.4k</Text>
                        <Text style={styles.statLabel}>This Month</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 2,
    },
    name: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 2,
    },
    specialty: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1D4ED8',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 20,
        marginBottom: 20,
    },
    availabilityCard: {
        backgroundColor: '#F0F9FF',
        borderColor: '#BAE6FD',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    availabilityInfo: {
        flex: 1,
        marginRight: 16,
    },
    availabilityTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    availabilitySubtitle: {
        fontSize: 13,
        color: '#475569',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 12,
        marginBottom: 16,
    },
    summaryItem: {
        alignItems: 'center',
        flex: 1,
    },
    summaryValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2563EB',
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
        textAlign: 'center',
    },
    dividerVertical: {
        width: 1,
        height: 40,
        backgroundColor: '#E2E8F0',
    },
    viewScheduleButton: {
        backgroundColor: '#2563EB',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    viewScheduleButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statCard: {
        flexBasis: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 16,
        alignItems: 'center',
    },
    statIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
        textAlign: 'center',
    },
});

export default DoctorDashboardScreen;