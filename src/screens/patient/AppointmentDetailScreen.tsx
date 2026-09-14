import React, { useMemo } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MOCK_APPOINTMENTS } from '../../data/mockAppointments';
import { APPOINTMENT_STATUS_THEME } from '../../types/appointment';
import type { AppointmentDetailScreenProps } from '../../navigation/navigation.types';

// ==========================================
// HELPERS
// ==========================================

const formatFullDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// ==========================================
// COMPONENT
// ==========================================

const AppointmentDetailScreen: React.FC<AppointmentDetailScreenProps> = ({
    route,
    navigation,
}) => {
    const { appointmentId } = route.params;

    const appointment = useMemo(() => {
        return MOCK_APPOINTMENTS.find((item) => item.id === appointmentId);
    }, [appointmentId]);

    if (!appointment) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.notFoundContainer}>
                    <Text style={styles.notFoundTitle}>Appointment not found</Text>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    const statusTheme = APPOINTMENT_STATUS_THEME[appointment.status];
    const isActionable =
        appointment.status === 'PENDING' || appointment.status === 'CONFIRMED';

    const handleCancel = (): void => {
        Alert.alert(
            'Cancel Appointment',
            'Are you sure you want to cancel this appointment? This action cannot be undone.',
            [
                { text: 'Keep Appointment', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: () => {
                        // TODO: Call API to cancel appointment
                        Alert.alert('Success', 'Appointment cancelled successfully.');
                        navigation.goBack();
                    },
                },
            ],
        );
    };

    const handleJoinCall = (): void => {
        // TODO: Navigate to WebRTC / Video Call screen
        Alert.alert('Joining Call', 'Connecting to your telemedicine session...');
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header Navigation */}
                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </Pressable>

                {/* Status Banner */}
                <View
                    style={[
                        styles.statusBanner,
                        { backgroundColor: statusTheme.backgroundColor },
                    ]}
                >
                    <Text style={styles.statusIcon}>{statusTheme.icon}</Text>
                    <Text style={[styles.statusLabel, { color: statusTheme.textColor }]}>
                        {statusTheme.label}
                    </Text>
                </View>

                {/* Doctor Info Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Doctor Details</Text>
                    <Text style={styles.doctorName}>{appointment.doctor.name}</Text>
                    <Text style={styles.specialty}>{appointment.doctor.specialty}</Text>
                </View>

                {/* Schedule Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Schedule</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date</Text>
                        <Text style={styles.infoValue}>
                            {formatFullDate(appointment.appointmentDate)}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Time</Text>
                        <Text style={styles.infoValue}>
                            {appointment.startTime} - {appointment.endTime}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Type</Text>
                        <Text style={styles.infoValue}>
                            {appointment.consultationType === 'ONLINE'
                                ? '💻 Online Consultation'
                                : '🏥 In-Person Visit'}
                        </Text>
                    </View>
                </View>

                {/* Reason & Notes Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Consultation Details</Text>

                    <Text style={styles.reasonLabel}>Reason for visit:</Text>
                    <Text style={styles.reasonText}>{appointment.reason}</Text>

                    {appointment.notes ? (
                        <>
                            <Text style={[styles.reasonLabel, { marginTop: 12 }]}>
                                Additional Notes:
                            </Text>
                            <Text style={styles.reasonText}>{appointment.notes}</Text>
                        </>
                    ) : null}

                    {appointment.cancelReason ? (
                        <>
                            <Text style={[styles.reasonLabel, { marginTop: 12, color: '#B91C1C' }]}>
                                Cancellation Reason:
                            </Text>
                            <Text style={[styles.reasonText, { color: '#B91C1C' }]}>
                                {appointment.cancelReason}
                            </Text>
                        </>
                    ) : null}
                </View>
            </ScrollView>

            {/* Action Footer */}
            {isActionable && (
                <View style={styles.footer}>
                    {appointment.status === 'CONFIRMED' &&
                        appointment.consultationType === 'ONLINE' && (
                            <Pressable
                                style={[styles.actionButton, styles.primaryButton]}
                                onPress={handleJoinCall}
                            >
                                <Text style={styles.primaryButtonText}>Join Video Call</Text>
                            </Pressable>
                        )}

                    <Pressable
                        style={[
                            styles.actionButton,
                            appointment.status === 'CONFIRMED' &&
                                appointment.consultationType === 'ONLINE'
                                ? styles.secondaryButton
                                : styles.primaryButton,
                        ]}
                        onPress={handleCancel}
                    >
                        <Text
                            style={[
                                appointment.status === 'CONFIRMED' &&
                                    appointment.consultationType === 'ONLINE'
                                    ? styles.secondaryButtonText
                                    : styles.primaryButtonText,
                            ]}
                        >
                            Cancel Appointment
                        </Text>
                    </Pressable>
                </View>
            )}
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
    backButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
    },
    backButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 20,
        gap: 8,
    },
    statusIcon: {
        fontSize: 20,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    doctorName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    specialty: {
        fontSize: 14,
        color: '#64748B',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748B',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
        flex: 1,
        textAlign: 'right',
        marginLeft: 12,
    },
    reasonLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 4,
    },
    reasonText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#334155',
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        gap: 10,
    },
    actionButton: {
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#EF4444',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    secondaryButtonText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '700',
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    notFoundTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 16,
    },
});

export default AppointmentDetailScreen;