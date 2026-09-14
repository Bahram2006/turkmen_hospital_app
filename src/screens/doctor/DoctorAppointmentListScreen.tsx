import React, { useState, useMemo, useCallback } from 'react';
import {
    Alert,
    FlatList,
    ListRenderItem,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { DoctorAppointmentListScreenProps } from '../../navigation/navigation.types';
import type { Appointment, AppointmentStatus } from '../../types/appointment';
import { APPOINTMENT_STATUS_THEME } from '../../types/appointment';
import { useAppointments } from '../../context/AppointmentContext';
import { useAuth } from '../../context/AuthContext';

// ==========================================
// TYPES
// ==========================================

type TabType = 'TODAY' | 'UPCOMING' | 'COMPLETED';

// ==========================================
// HELPERS
// ==========================================

const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
};

const isToday = (isoDate: string): boolean => {
    const date = new Date(isoDate);
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

const isFuture = (isoDate: string): boolean => {
    const date = new Date(isoDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
};

// ==========================================
// COMPONENT
// ==========================================

const DoctorAppointmentListScreen: React.FC<DoctorAppointmentListScreenProps> = ({
    navigation,
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('TODAY');
    // Local state to simulate optimistic updates for accept/reject
    const { userInfo } = useAuth();
    const { getDoctorAppointments, updateAppointmentStatus } = useAppointments();

    const appointments = useMemo(() => {
        if (!userInfo) return [];
        return getDoctorAppointments(userInfo.id);
    }, [getDoctorAppointments, userInfo]);

    const filteredAppointments = useMemo<Appointment[]>(() => {
        return appointments.filter((apt) => {
            if (activeTab === 'TODAY') {
                return isToday(apt.appointmentDate) && apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED';
            }
            if (activeTab === 'UPCOMING') {
                return isFuture(apt.appointmentDate) && !isToday(apt.appointmentDate) && apt.status !== 'COMPLETED';
            }
            if (activeTab === 'COMPLETED') {
                return apt.status === 'COMPLETED' || apt.status === 'CANCELLED';
            }
            return false;
        }).sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
    }, [appointments, activeTab]);

    const handleStatusUpdate = useCallback(
        (appointmentId: string, newStatus: AppointmentStatus): void => {
            Alert.alert(
                `${newStatus === 'CONFIRMED' ? 'Accept' : 'Reject'} Appointment`,
                `Are you sure you want to ${newStatus === 'CONFIRMED' ? 'accept' : 'reject'} this request?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Confirm',
                        style: newStatus === 'CANCELLED' ? 'destructive' : 'default',
                        onPress: () => {
                            // Optimistic UI Update
                            updateAppointmentStatus(appointmentId, newStatus);
                        },
                    },
                ]
            );
        },
        [updateAppointmentStatus]
    );

    const renderAppointment: ListRenderItem<Appointment> = ({ item }) => {
        const statusTheme = APPOINTMENT_STATUS_THEME[item.status];
        const isPending = item.status === 'PENDING';

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.patientInfo}>
                        <Text style={styles.patientName} numberOfLines={1}>
                            {item.patientName}
                        </Text>
                        <Text style={styles.reason} numberOfLines={2}>
                            {item.reason}
                        </Text>
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

                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>📅 {formatDate(item.appointmentDate)}</Text>
                    <Text style={styles.metaText}>🕒 {item.startTime} - {item.endTime}</Text>
                    <Text style={styles.metaText}>
                        {item.consultationType === 'ONLINE' ? '💻 Online' : '🏥 In-Person'}
                    </Text>
                </View>

                {/* Action Buttons - Only visible for PENDING requests */}
                {isPending && (
                    <View style={styles.actionsRow}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.actionButton,
                                styles.rejectButton,
                                pressed ? styles.buttonPressed : undefined,
                            ]}
                            onPress={() => handleStatusUpdate(item.id, 'CANCELLED')}
                        >
                            <Text style={styles.rejectButtonText}>Reject</Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.actionButton,
                                styles.acceptButton,
                                pressed ? styles.buttonPressed : undefined,
                            ]}
                            onPress={() => handleStatusUpdate(item.id, 'CONFIRMED')}
                        >
                            <Text style={styles.acceptButtonText}>Accept</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </Pressable>
                <Text style={styles.title}>Manage Appointments</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabBar}>
                {(['TODAY', 'UPCOMING', 'COMPLETED'] as const).map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <Pressable
                            key={tab}
                            style={[styles.tab, isActive ? styles.tabActive : undefined]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    isActive ? styles.tabTextActive : undefined,
                                ]}
                            >
                                {tab.charAt(0) + tab.slice(1).toLowerCase()}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <FlatList
                data={filteredAppointments}
                keyExtractor={(item) => item.id}
                renderItem={renderAppointment}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>📅</Text>
                        <Text style={styles.emptyStateTitle}>No appointments yet</Text>
                        <Text style={styles.emptyStateSubtitle}>
                            Book your first consultation to get started.
                        </Text>
                        {activeTab === 'UPCOMING' && (
                            <Pressable
                                style={styles.emptyStateButton}
                                onPress={() => navigation.navigate('DoctorDashboard')}
                            >
                                <Text style={styles.emptyStateButtonText}>Find a Doctor</Text>
                            </Pressable>
                        )}
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
    emptyStateIcon: {
        fontSize: 36,
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyStateButton: {
        marginTop: 16,
        backgroundColor: '#2563EB',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
    },
    emptyStateButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 12,
        padding: 4,
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2563EB',
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        gap: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
    },
    tabActive: {
        backgroundColor: '#2563EB',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    listContent: {
        padding: 20,
        flexGrow: 1,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 16,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    patientInfo: {
        flex: 1,
        marginRight: 12,
    },
    patientName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    reason: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 12,
    },
    metaText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#475569',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    rejectButton: {
        backgroundColor: '#FEE2E2',
    },
    rejectButtonText: {
        color: '#B91C1C',
        fontSize: 14,
        fontWeight: '700',
    },
    acceptButton: {
        backgroundColor: '#DCFCE7',
    },
    acceptButtonText: {
        color: '#166534',
        fontSize: 14,
        fontWeight: '700',
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    emptyStateSubtitle: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
    },
});

export default DoctorAppointmentListScreen;