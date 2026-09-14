import React, { useMemo, useState } from 'react';
import {
    FlatList,
    ListRenderItem,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppointments } from '../../context/AppointmentContext';
import { useAuth } from '../../context/AuthContext';
import type { Appointment, AppointmentStatus } from '../../types/appointment';
import { APPOINTMENT_STATUS_THEME } from '../../types/appointment';
import type { AppointmentListScreenProps } from '../../navigation/navigation.types';

// ==========================================
// TYPES
// ==========================================

type TabType = 'UPCOMING' | 'PAST';

// ==========================================
// HELPERS
// ==========================================

const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
};

const isUpcoming = (isoDate: string): boolean => {
    const appointmentDate = new Date(isoDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
};

// ==========================================
// COMPONENT
// ==========================================

const AppointmentListScreen: React.FC<AppointmentListScreenProps> = ({
    navigation,
}) => {
    const { userInfo } = useAuth();
    const { getPatientAppointments, updateAppointmentStatus } = useAppointments();
    const [activeTab, setActiveTab] = useState<TabType>('UPCOMING');

    const myAppointments = useMemo(() => {
        if (!userInfo) return [];
        return getPatientAppointments(userInfo.id);
    }, [getPatientAppointments, userInfo]);

    const filteredAppointments = useMemo<Appointment[]>(() => {
        return myAppointments.filter((appointment) => {
            if (activeTab === 'UPCOMING') {
                return (
                    appointment.status === 'PENDING' ||
                    appointment.status === 'CONFIRMED'
                );
            }
            return (
                appointment.status === 'COMPLETED' ||
                appointment.status === 'CANCELLED'
            );
        });
    }, [myAppointments, activeTab]);

    const handleViewDetails = (appointmentId: string): void => {
        navigation.navigate('AppointmentDetail', { appointmentId });
    };

    const renderAppointment: ListRenderItem<Appointment> = ({ item }) => {
        {
            (item.status === 'PENDING' || item.status === 'CONFIRMED') && (
                <Pressable
                    style={styles.cancelButton}
                    onPress={() => updateAppointmentStatus(item.id, 'CANCELLED')}
                >
                    <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
                </Pressable>
            )
        }
        const statusTheme = APPOINTMENT_STATUS_THEME[item.status];

        return (
            <Pressable
                style={({ pressed }) => [
                    styles.card,
                    pressed ? styles.cardPressed : undefined,
                ]}
                onPress={() => handleViewDetails(item.id)}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.doctorInfo}>
                        <Text style={styles.doctorName} numberOfLines={1}>
                            {item.doctor.name}
                        </Text>
                        <Text style={styles.specialty} numberOfLines={1}>
                            {item.doctor.specialty}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: statusTheme.backgroundColor },
                        ]}
                    >
                        <Text style={[styles.statusText, { color: statusTheme.textColor }]}>
                            {statusTheme.icon} {statusTheme.label}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>📅</Text>
                        <Text style={styles.detailText}>
                            {formatDate(item.appointmentDate)}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>🕒</Text>
                        <Text style={styles.detailText}>
                            {item.startTime} - {item.endTime}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>
                            {item.consultationType === 'ONLINE' ? '💻' : '🏥'}
                        </Text>
                        <Text style={styles.detailText}>
                            {item.consultationType === 'ONLINE' ? 'Online' : 'In-Person'}
                        </Text>
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>My Appointments</Text>

                {/* Custom Tab Bar */}
                <View style={styles.tabBar}>
                    {(['UPCOMING', 'PAST'] as const).map((tab) => {
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
                                    {tab === 'UPCOMING' ? 'Upcoming' : 'Past'}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            <FlatList
                data={filteredAppointments}
                keyExtractor={(item) => item.id}
                renderItem={renderAppointment}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>
                            {activeTab === 'UPCOMING' ? '📅' : '📂'}
                        </Text>
                        <Text style={styles.emptyStateTitle}>
                            No {activeTab === 'UPCOMING' ? 'upcoming' : 'past'} appointments
                        </Text>
                        <Text style={styles.emptyStateSubtitle}>
                            {activeTab === 'UPCOMING'
                                ? 'Book a consultation to see it here.'
                                : 'Your appointment history will appear here.'}
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
    cancelButton: {
        marginTop: 10,
        backgroundColor: '#FEE2E2',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    cancelButtonText: {
        color: '#DC2626',
        fontSize: 12,
        fontWeight: '600',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 16,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    tabActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    tabTextActive: {
        color: '#0F172A',
        fontWeight: '700',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingVertical: 16,
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
    cardPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.99 }],
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    doctorInfo: {
        flex: 1,
        marginRight: 12,
    },
    doctorName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 2,
    },
    specialty: {
        fontSize: 13,
        color: '#64748B',
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
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    detailText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#475569',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyStateIcon: {
        fontSize: 48,
        marginBottom: 16,
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

export default AppointmentListScreen;