import React from 'react';
import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

// ==========================================
// TYPES
// ==========================================

type ConsultationType = 'ONLINE' | 'IN_PERSON';

type StatId =
    | 'TODAY_PATIENTS'
    | 'PENDING_REQUESTS'
    | 'COMPLETED_CONSULTATIONS';

interface DashboardStat {
    id: StatId;
    label: string;
    value: number;
    accentColor: string;
}

interface TodayAppointment {
    id: string;
    patientName: string;
    time: string;
    type: ConsultationType;
    reason: string;
}

interface ConsultationTypeTheme {
    backgroundColor: string;
    textColor: string;
}

// ==========================================
// MOCK DATA / HELPERS
// ==========================================

const TODAY_STATS: DashboardStat[] = [
    {
        id: 'TODAY_PATIENTS',
        label: "Today's Patients",
        value: 8,
        accentColor: '#2563EB',
    },
    {
        id: 'PENDING_REQUESTS',
        label: 'Pending Requests',
        value: 3,
        accentColor: '#F59E0B',
    },
    {
        id: 'COMPLETED_CONSULTATIONS',
        label: 'Completed',
        value: 2,
        accentColor: '#16A34A',
    },
];

const TODAY_SCHEDULE: TodayAppointment[] = [
    {
        id: 'today-appointment-1',
        patientName: 'John Smith',
        time: '09:00',
        type: 'ONLINE',
        reason: 'Follow-up consultation',
    },
    {
        id: 'today-appointment-2',
        patientName: 'Amina Yusuf',
        time: '10:30',
        type: 'IN_PERSON',
        reason: 'Chest pain evaluation',
    },
    {
        id: 'today-appointment-3',
        patientName: 'Daniel Brown',
        time: '13:00',
        type: 'ONLINE',
        reason: 'Prescription renewal',
    },
    {
        id: 'today-appointment-4',
        patientName: 'Fatima Noor',
        time: '15:15',
        type: 'IN_PERSON',
        reason: 'Blood pressure review',
    },
];

const CONSULTATION_TYPE_LABEL: Record<ConsultationType, string> = {
    ONLINE: 'Online',
    IN_PERSON: 'In-Person',
};

const CONSULTATION_TYPE_THEME: Record<
    ConsultationType,
    ConsultationTypeTheme
> = {
    ONLINE: {
        backgroundColor: '#DBEAFE',
        textColor: '#1D4ED8',
    },
    IN_PERSON: {
        backgroundColor: '#F3E8FF',
        textColor: '#7E22CE',
    },
};

const getDoctorDisplayName = (fullName: string): string => {
    const trimmedName = fullName.trim();

    if (trimmedName.startsWith('Dr.')) {
        return trimmedName;
    }

    return `Dr. ${trimmedName}`;
};

// ==========================================
// COMPONENT
// ==========================================

const DoctorDashboardScreen: React.FC = () => {
    const { userInfo } = useAuth();

    const doctorName = getDoctorDisplayName(userInfo?.fullName ?? 'Doctor');

    const renderStat = (stat: DashboardStat): React.ReactElement => {
        return (
            <View key={stat.id} style={styles.statCard}>
                <Text style={[styles.statValue, { color: stat.accentColor }]}>
                    {stat.value}
                </Text>

                <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
        );
    };

    const renderAppointment: ListRenderItem<TodayAppointment> = ({ item }) => {
        const typeTheme = CONSULTATION_TYPE_THEME[item.type];
        const typeLabel = CONSULTATION_TYPE_LABEL[item.type];

        return (
            <View style={styles.scheduleCard}>
                <View style={styles.scheduleHeaderRow}>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{item.time}</Text>
                    </View>

                    <View
                        style={[
                            styles.typeBadge,
                            { backgroundColor: typeTheme.backgroundColor },
                        ]}
                    >
                        <Text style={[styles.typeText, { color: typeTheme.textColor }]}>
                            {typeLabel}
                        </Text>
                    </View>
                </View>

                <Text style={styles.patientName}>{item.patientName}</Text>

                <Text style={styles.patientReason}>{item.reason}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <FlatList
                data={TODAY_SCHEDULE}
                keyExtractor={(item) => item.id}
                renderItem={renderAppointment}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View>
                        <View style={styles.header}>
                            <Text style={styles.greeting}>Welcome,</Text>
                            <Text style={styles.userName}>{doctorName}</Text>
                            <Text style={styles.subtitle}>
                                Here is your consultation schedule for today.
                            </Text>
                        </View>

                        <View style={styles.statsRow}>{TODAY_STATS.map(renderStat)}</View>

                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Today&apos;s Schedule</Text>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateTitle}>No appointments today</Text>
                        <Text style={styles.emptyStateSubtitle}>
                            New consultation requests will appear here.
                        </Text>
                    </View>
                }
            />
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
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    header: {
        paddingTop: 16,
        marginBottom: 24,
    },
    greeting: {
        fontSize: 15,
        color: '#64748B',
        marginBottom: 4,
    },
    userName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 28,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingVertical: 14,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
        textAlign: 'center',
    },
    sectionHeader: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
    },
    scheduleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 16,
        marginBottom: 12,
    },
    scheduleHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    timeContainer: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    timeText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    typeText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    patientName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    patientReason: {
        fontSize: 13,
        color: '#64748B',
    },
    emptyState: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 20,
        alignItems: 'center',
    },
    emptyStateTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    emptyStateSubtitle: {
        fontSize: 13,
        color: '#64748B',
    },
});

export default DoctorDashboardScreen;