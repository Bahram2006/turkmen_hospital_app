import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApi } from '../../hooks/useApi';
import type { DashboardData, Appointment } from '../../types/clinic.types';

// ==========================================
// HELPER COMPONENTS
// ==========================================

const StatusBadge: React.FC<{ status: Appointment['status'] }> = ({ status }) => {
    const stylesMap: Record<Appointment['status'], { bg: string; text: string }> = {
        PENDING: { bg: '#FEF3C7', text: '#D97706' },
        CONFIRMED: { bg: '#DCFCE7', text: '#16A34A' },
        COMPLETED: { bg: '#E0E7FF', text: '#4F46E5' },
        CANCELLED: { bg: '#FEE2E2', text: '#DC2626' },
    };

    const theme = stylesMap[status];

    return (
        <View style={[styles.badge, { backgroundColor: theme.bg }]}>
            <Text style={[styles.badgeText, { color: theme.text }]}>{status}</Text>
        </View>
    );
};

const AppointmentCard: React.FC<{ item: Appointment }> = ({ item }) => {
    const formattedDate = new Date(item.appointmentDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.avatarPlaceholder}>
                    <Ionicons name="medkit" size={20} color="#2563EB" />
                </View>
                <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{item.doctor.fullName}</Text>
                    <Text style={styles.specialty}>{item.doctor.specialty}</Text>
                </View>
                <StatusBadge status={item.status} />
            </View>

            <View style={styles.cardFooter}>
                <Ionicons name="time-outline" size={14} color="#64748B" />
                <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
        </View>
    );
};

// ==========================================
// MAIN SCREEN COMPONENT
// ==========================================

export default function DashboardScreen() {
    // Point this to your NestJS backend endpoint
    const { data, isLoading, error, refetch } = useApi<DashboardData>('/patients/dashboard');

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading your health data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Ionicons name="cloud-offline-outline" size={48} color="#EF4444" />
                <Text style={styles.errorTitle}>Unable to load data</Text>
                <Text style={styles.errorMessage}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const stats = data?.stats;
    const appointments = data?.upcomingAppointments || [];

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <AppointmentCard item={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} colors={['#2563EB']} />
                }
                ListHeaderComponent={
                    <View style={styles.headerSection}>
                        {/* Stats Row */}
                        <View style={styles.statsRow}>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{stats?.upcomingCount || 0}</Text>
                                <Text style={styles.statLabel}>Upcoming</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{stats?.completedCount || 0}</Text>
                                <Text style={styles.statLabel}>Completed</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{stats?.totalAppointments || 0}</Text>
                                <Text style={styles.statLabel}>Total</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-clear-outline" size={64} color="#CBD5E1" />
                        <Text style={styles.emptyTitle}>No upcoming appointments</Text>
                        <Text style={styles.emptySubtitle}>
                            Book a consultation with a specialist to get started.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F8FAFC' },
    loadingText: { marginTop: 12, color: '#64748B', fontSize: 14 },
    listContent: { padding: 16, paddingBottom: 32 },

    // Header & Stats
    headerSection: { marginBottom: 8 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 12 },
    statCard: {
        flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
        alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0'
    },
    statValue: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
    statLabel: { fontSize: 12, fontWeight: '600', color: '#64748B', marginTop: 4 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 12 },

    // Cards
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12,
        borderWidth: 1, borderColor: '#E2E8F0'
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    avatarPlaceholder: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: '#EFF6FF',
        justifyContent: 'center', alignItems: 'center', marginRight: 12
    },
    doctorInfo: { flex: 1 },
    doctorName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
    specialty: { fontSize: 13, color: '#64748B', marginTop: 2 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
    badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
    cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dateText: { fontSize: 13, color: '#475569', fontWeight: '500' },

    // States
    errorTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginTop: 16 },
    errorMessage: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 8 },
    retryButton: { marginTop: 24, backgroundColor: '#2563EB', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
    retryText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginTop: 16 },
    emptySubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 8, paddingHorizontal: 32 },
});