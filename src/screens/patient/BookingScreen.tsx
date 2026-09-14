import React, { useState, useMemo } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PatientStackParamList } from '../../navigation/navigation.types';
import { useAppointments } from '../../context/AppointmentContext';
import { generateTimeSlots } from '../../utils/timeSlots';
import { MOCK_DOCTORS } from '../../data/mockDoctors';

type BookingScreenProps = NativeStackScreenProps<PatientStackParamList, 'Booking'>;

const CONSULTATION_TYPES = [
    { id: 'ONLINE', label: '💻 Online Video', description: 'Virtual consultation' },
    { id: 'IN_PERSON', label: '🏥 In-Person', description: 'Visit the clinic' },
] as const;

const BookingScreen: React.FC<BookingScreenProps> = ({ route, navigation }) => {
    const { doctorId } = route.params;
    const { bookAppointment } = useAppointments();

    const doctor = useMemo(
        () => MOCK_DOCTORS.find((d) => d.id === doctorId),
        [doctorId]
    );

    // Form State
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [consultationType, setConsultationType] = useState<'ONLINE' | 'IN_PERSON'>('ONLINE');
    const [reason, setReason] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Generate next 7 days for date selection
    const availableDates = useMemo(() => {
        const dates: { id: string; label: string; iso: string }[] = [];
        for (let i = 1; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            // Skip Sundays
            if (date.getDay() === 0) continue;

            dates.push({
                id: `date-${i}`,
                label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                iso: date.toISOString(),
            });
        }
        return dates;
    }, []);

    // Generate time slots (mocking some as booked)
    const timeSlots = useMemo(() => {
        return generateTimeSlots(9, 17, ['10:00', '14:30']);
    }, []);

    const handleBook = async (): Promise<void> => {
        if (!selectedDate || !selectedSlot || !reason.trim()) {
            Alert.alert('Missing Information', 'Please select a date, time slot, and provide a reason for your visit.');
            return;
        }

        if (!doctor) return;

        setIsSubmitting(true);

        try {
            const slot = timeSlots.find((s) => s.time === selectedSlot);

            bookAppointment({
                doctorId: doctor.id,
                doctorName: doctor.name,
                specialty: doctor.specialty,
                appointmentDate: selectedDate,
                startTime: selectedSlot,
                endTime: slot?.endTime || '',
                reason: reason.trim(),
                consultationType,
            });

            Alert.alert(
                'Appointment Requested!',
                `Your request with ${doctor.name} has been sent. You will be notified once confirmed.`,
                [{ text: 'OK', onPress: () => navigation.popToTop() }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to book appointment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!doctor) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.errorText}>Doctor not found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← Back</Text>
                    </Pressable>
                    <Text style={styles.title}>Book Appointment</Text>
                </View>

                {/* Doctor Summary Card */}
                <View style={styles.doctorCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{doctor.name.charAt(0)}</Text>
                    </View>
                    <View>
                        <Text style={styles.doctorName}>{doctor.name}</Text>
                        <Text style={styles.specialty}>{doctor.specialty}</Text>
                    </View>
                </View>

                {/* Section: Consultation Type */}
                <Text style={styles.sectionTitle}>Consultation Type</Text>
                <View style={styles.typeRow}>
                    {CONSULTATION_TYPES.map((type) => {
                        const isActive = consultationType === type.id;
                        return (
                            <Pressable
                                key={type.id}
                                style={[styles.typeCard, isActive && styles.typeCardActive]}
                                onPress={() => setConsultationType(type.id)}
                            >
                                <Text style={[styles.typeLabel, isActive && styles.typeLabelActive]}>
                                    {type.label}
                                </Text>
                                <Text style={styles.typeDesc}>{type.description}</Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* Section: Select Date */}
                <Text style={styles.sectionTitle}>Select Date</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
                    {availableDates.map((date) => {
                        const isActive = selectedDate === date.iso;
                        return (
                            <Pressable
                                key={date.id}
                                style={[styles.dateChip, isActive && styles.dateChipActive]}
                                onPress={() => setSelectedDate(date.iso)}
                            >
                                <Text style={[styles.dateText, isActive && styles.dateTextActive]}>
                                    {date.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Section: Select Time */}
                <Text style={styles.sectionTitle}>Available Time Slots</Text>
                <View style={styles.slotsGrid}>
                    {timeSlots.map((slot) => {
                        const isSelected = selectedSlot === slot.time;
                        const isDisabled = !slot.isAvailable;

                        return (
                            <Pressable
                                key={slot.id}
                                disabled={isDisabled}
                                style={[
                                    styles.slotChip,
                                    isSelected && styles.slotChipSelected,
                                    isDisabled && styles.slotChipDisabled,
                                ]}
                                onPress={() => setSelectedSlot(slot.time)}
                            >
                                <Text
                                    style={[
                                        styles.slotText,
                                        isSelected && styles.slotTextSelected,
                                        isDisabled && styles.slotTextDisabled,
                                    ]}
                                >
                                    {slot.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* Section: Reason */}
                <Text style={styles.sectionTitle}>Reason for Visit</Text>
                <TextInput
                    style={styles.textArea}
                    placeholder="Describe your symptoms or reason for visit..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={reason}
                    onChangeText={setReason}
                />

            </ScrollView>

            {/* Footer Action */}
            <View style={styles.footer}>
                <Pressable
                    style={[styles.bookButton, isSubmitting && styles.bookButtonDisabled]}
                    disabled={isSubmitting}
                    onPress={handleBook}
                >
                    <Text style={styles.bookButtonText}>
                        {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
    content: { padding: 20, paddingBottom: 100 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backButton: { marginRight: 12, padding: 4 },
    backButtonText: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
    title: { fontSize: 20, fontWeight: '800', color: '#0F172A' },

    doctorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 24,
    },
    avatar: {
        width: 48, height: 48, borderRadius: 24, backgroundColor: '#DBEAFE',
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    avatarText: { fontSize: 18, fontWeight: '800', color: '#1D4ED8' },
    doctorName: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
    specialty: { fontSize: 13, color: '#64748B' },

    sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 10 },

    typeRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    typeCard: {
        flex: 1, padding: 14, borderRadius: 12, borderWidth: 1,
        borderColor: '#E2E8F0', backgroundColor: '#FFFFFF',
    },
    typeCardActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
    typeLabel: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
    typeLabelActive: { color: '#2563EB' },
    typeDesc: { fontSize: 11, color: '#64748B' },

    datesRow: { paddingRight: 20, marginBottom: 24, gap: 8 },
    dateChip: {
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10,
        backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
    },
    dateChipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
    dateText: { fontSize: 13, fontWeight: '600', color: '#475569' },
    dateTextActive: { color: '#FFFFFF' },

    slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
    slotChip: {
        width: '31%', paddingVertical: 10, borderRadius: 10,
        backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center',
    },
    slotChipSelected: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
    slotChipDisabled: { backgroundColor: '#F1F5F9', borderColor: '#F1F5F9' },
    slotText: { fontSize: 13, fontWeight: '600', color: '#334155' },
    slotTextSelected: { color: '#FFFFFF' },
    slotTextDisabled: { color: '#CBD5E1' },

    textArea: {
        backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
        borderRadius: 12, padding: 14, fontSize: 14, color: '#0F172A',
        minHeight: 100, marginBottom: 24,
    },

    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#FFFFFF', padding: 20, borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    bookButton: {
        backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 14, alignItems: 'center',
    },
    bookButtonDisabled: { opacity: 0.7 },
    bookButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    errorText: { textAlign: 'center', marginTop: 40, color: '#EF4444' },
});

export default BookingScreen;