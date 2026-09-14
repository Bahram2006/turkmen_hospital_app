import React, { useMemo, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MOCK_DOCTORS } from '../../data/mockDoctors';
import type { Doctor } from '../../types/doctor';
import type { DoctorDetailScreenProps } from '../../navigation/navigation.types';

// ==========================================
// CONSTANTS & HELPERS
// ==========================================

const TIME_SLOTS: readonly string[] = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
];

const getInitials = (name: string): string => {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
};

const formatFee = (fee: number | undefined): string => {
    return `$${(fee ?? 0).toFixed(2)}`;
};

const formatRating = (rating: number | undefined): string => {
    return Number(rating ?? 0).toFixed(1);
};

// ==========================================
// COMPONENT
// ==========================================

const DoctorDetailScreen: React.FC<DoctorDetailScreenProps> = ({
    route,
    navigation,
}) => {
    const { doctorId } = route.params;

    const doctor = useMemo<Doctor | undefined>(() => {
        return MOCK_DOCTORS.find((item) => item.id === doctorId);
    }, [doctorId]);

    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(
        null,
    );

    if (!doctor) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.notFoundContainer}>
                    <Text style={styles.notFoundTitle}>Doctor not found</Text>

                    <Text style={styles.notFoundSubtitle}>
                        The doctor you are trying to view does not exist.
                    </Text>

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

    const handleConfirmAppointment = (): void => {
        if (!selectedTimeSlot) {
            return;
        }

        // TODO: Replace with real appointment booking API call.
        Alert.alert(
            'Appointment Requested',
            `Your appointment request with ${doctor.name} at ${selectedTimeSlot} has been submitted.`,
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </Pressable>

                <View style={styles.headerCard}>
                    <View style={styles.avatarRow}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>{getInitials(doctor.name)}</Text>
                        </View>

                        <View style={styles.titleContainer}>
                            <Text style={styles.doctorName}>{doctor.name}</Text>
                            <Text style={styles.specialty}>{doctor.specialty}</Text>
                        </View>
                    </View>

                    <View style={styles.metaRow}>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>
                                ★ {formatRating(doctor.rating)}
                            </Text>
                        </View>

                        <Text style={styles.experienceText}>
                            {doctor.experienceYears} yrs experience
                        </Text>
                    </View>

                    <View style={styles.feeRow}>
                        <Text style={styles.feeLabel}>Consultation Fee</Text>
                        <Text style={styles.feeValue}>
                            {formatFee(doctor.consultationFee)}
                        </Text>
                    </View>

                    <Text style={styles.bioText}>{doctor.bio}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Time Slot</Text>

                    <View style={styles.timeSlotsGrid}>
                        {TIME_SLOTS.map((slot) => {
                            const isSelected = slot === selectedTimeSlot;

                            return (
                                <Pressable
                                    key={slot}
                                    style={[
                                        styles.timeSlot,
                                        isSelected ? styles.timeSlotSelected : undefined,
                                    ]}
                                    onPress={() => setSelectedTimeSlot(slot)}
                                >
                                    <Text
                                        style={[
                                            styles.timeSlotText,
                                            isSelected ? styles.timeSlotTextSelected : undefined,
                                        ]}
                                    >
                                        {slot}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Pressable
                    style={[
                        styles.confirmButton,
                        !selectedTimeSlot ? styles.confirmButtonDisabled : undefined,
                    ]}
                    disabled={!selectedTimeSlot}
                    onPress={handleConfirmAppointment}
                >
                    <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
                </Pressable>
            </View>
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
        paddingBottom: 32,
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
    headerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 20,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    avatarText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1D4ED8',
    },
    titleContainer: {
        flex: 1,
    },
    doctorName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    specialty: {
        fontSize: 14,
        color: '#64748B',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        marginRight: 10,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#B45309',
    },
    experienceText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
    },
    feeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 12,
        marginBottom: 16,
    },
    feeLabel: {
        fontSize: 13,
        color: '#64748B',
    },
    feeValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
    },
    bioText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#475569',
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 12,
    },
    timeSlotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    timeSlot: {
        flexBasis: '31%',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    timeSlotSelected: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    timeSlotText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
    },
    timeSlotTextSelected: {
        color: '#FFFFFF',
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    confirmButton: {
        backgroundColor: '#2563EB',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: '#93C5FD',
    },
    confirmButtonText: {
        color: '#FFFFFF',
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
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 8,
    },
    notFoundSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 24,
    },
});

export default DoctorDetailScreen;