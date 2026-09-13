import React, { useCallback } from 'react';
import {
    FlatList,
    ListRenderItem,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

// ==========================================
// TYPES
// ==========================================

type AppointmentStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'CANCELLED'
    | 'COMPLETED';

type QuickActionId =
    | 'BOOK_APPOINTMENT'
    | 'MY_APPOINTMENTS'
    | 'MEDICAL_RECORDS';

interface UpcomingAppointment {
    id: string;
    doctorName: string;
    specialization: string;
    appointmentDate: string;
    status: AppointmentStatus;
}

interface QuickAction {
    id: QuickActionId;
    title: string;
    description: string;
    icon: string;
}

interface StatusTheme {
    label: string;
    backgroundColor: string;
    textColor: string;
}

// ==========================================
// MOCK DATA / HELPERS
// ==========================================

const WEEKDAYS: readonly string[] = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
];

const MONTHS: readonly string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
        return 'Invalid date';
    }

    const weekday = WEEKDAYS[date.getDay()] ?? '';
    const month = MONTHS[date.getMonth()] ?? '';

    return `${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`;
};

const createUpcomingDate = (daysFromNow: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(10, 0, 0, 0);

    return date.toISOString();
};

const QUICK_ACTIONS: QuickAction[] = [
    {
        id: 'BOOK_APPOINTMENT',
        title: 'Book Appointment',
        description: 'Find a doctor and schedule a visit.',
        icon: '🗓️',
    },
    {
        id: 'MY_APPOINTMENTS',
        title: 'My Appointments',
        description: 'Track upcoming consultations.',
        icon: '📋',
    },
    {
        id: 'MEDICAL_RECORDS',
        title: 'Medical Records',
        description: 'View reports and prescriptions.',
        icon: '🩺',
    },
];

const UPCOMING_APPOINTMENTS: UpcomingAppointment[] = [
    {
        id: 'appointment-1',
        doctorName: 'Dr. Sarah Jenkins',
        specialization: 'Cardiology',
        appointmentDate: createUpcomingDate(1),
        status: 'CONFIRMED',
    },
    {
        id: 'appointment-2',
        doctorName: 'Dr. Omar Khalid',
        specialization: 'Dermatology',
        appointmentDate: createUpcomingDate(3),
        status: 'PENDING',
    },
    {
        id: 'appointment-3',
        doctorName: 'Dr. Emily Carter',
        specialization: 'General Medicine',
        appointmentDate: createUpcomingDate(7),
        status: 'COMPLETED',
    },
];

const STATUS_THEME: Record<AppointmentStatus, StatusTheme> = {
    PENDING: {
        label: 'Pending',
        backgroundColor: '#FEF3C7',
        textColor: '#B45309',
    },
    CONFIRMED: {
        label: 'Confirmed',
        backgroundColor: '#DCFCE7',
        textColor: '#166534',
    },
    CANCELLED: {
        label: 'Cancelled',
        backgroundColor: '#FEE2E2',
        textColor: '#B91C1C',
    },
    COMPLETED: {
        label: 'Completed',
        backgroundColor: '#E0E7FF',
        textColor: '#3730A3',
    },
};

// ==========================================
// COMPONENT
// ==========================================

const PatientDashboardScreen: React.FC = () => {
    const { userInfo } = useAuth();

    const patientName = userInfo?.fullName ?? 'Patient';

    const handleQuickAction = useCallback((action: QuickAction): void => {
        // TODO: Replace with actual navigation when routes are implemented.
        console.info(`Navigate to: ${action.id}`);
    }, []);

    const renderQuickAction = useCallback(
        (action: QuickAction): React.ReactElement => {
            return (
                <Pressable
                    key={action.id}
                    style={({ pressed }) => [
                        styles.quickActionCard,
                        pressed ? styles.pressedCard : undefined,
                    ]}
                    onPress={() => handleQuickAction(action)}
                >
                    <Text style={styles.quickActionIcon}>{action.icon}</Text>

                    <Text style={styles.quickActionTitle}>{action.title}</Text>

                    <Text style={styles.quickActionDescription}>
                        {action.description}
                    </Text>
                </Pressable>
            );
        },
        [handleQuickAction],
    );

    const renderAppointment: ListRenderItem<UpcomingAppointment> = ({
        item,
    }) => {
        const statusTheme = STATUS_THEME[item.status];

        return (
            <View style={styles.appointmentCard}>
                <View style={styles.appointmentTopRow}>
                    <View style={styles.appointmentInfo}>
                        <Text style={styles.doctorName}>{item.doctorName}</Text>
                        <Text style={styles.specialization}>{item.specialization}</Text>
                    </View>

                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: statusTheme.backgroundColor },
                        ]}
                    >
                        <Text style={[styles.statusText, { color: statusTheme.textColor }]}>
                            {statusTheme.label}
                        </Text>
                    </View>
                </View>

                <View style={styles.appointmentFooter}>
                    <Text style={styles.appointmentDate}>
                        {formatDate(item.appointmentDate)}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <FlatList
                data={UPCOMING_APPOINTMENTS}
                keyExtractor={(item) => item.id}
                renderItem={renderAppointment}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View>
                        <View style={styles.header}>
                            <Text style={styles.greeting}>Welcome,</Text>
                            <Text style={styles.userName}>{patientName}</Text>
                            <Text style={styles.subtitle}>
                                Manage your consultations and health records.
                            </Text>
                        </View>

                        <Text style={styles.sectionTitle}>Quick Actions</Text>

                        <View style={styles.quickActionsGrid}>
                            {QUICK_ACTIONS.map(renderQuickAction)}
                        </View>

                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>

                            <Pressable onPress={() => console.info('View all appointments')}>
                                <Text style={styles.viewAllText}>View all</Text>
                            </Pressable>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateTitle}>No upcoming appointments</Text>
                        <Text style={styles.emptyStateSubtitle}>
                            Book a consultation to get started.
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 28,
        marginBottom: 12,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 8,
    },
    quickActionCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    pressedCard: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    quickActionIcon: {
        fontSize: 24,
        marginBottom: 10,
    },
    quickActionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    quickActionDescription: {
        fontSize: 12,
        color: '#64748B',
    },
    appointmentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 16,
        marginBottom: 12,
    },
    appointmentTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 12,
    },
    appointmentInfo: {
        flex: 1,
    },
    doctorName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    specialization: {
        fontSize: 13,
        color: '#64748B',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    appointmentFooter: {
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 10,
    },
    appointmentDate: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
    },
    viewAllText: {
        color: '#2563EB',
        fontWeight: '600',
        fontSize: 14,
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

export default PatientDashboardScreen;