import React, { useMemo, useState } from 'react';
import {
    FlatList,
    ListRenderItem,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MOCK_DOCTORS } from '../../data/mockDoctors';
import type { Doctor } from '../../types/doctor';
import type { DoctorListScreenProps } from '../../navigation/navigation.types';

// ==========================================
// CONSTANTS & HELPERS
// ==========================================

const ALL_SPECIALTIES = 'All';

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

const DoctorListScreen: React.FC<DoctorListScreenProps> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedSpecialty, setSelectedSpecialty] =
        useState<string>(ALL_SPECIALTIES);

    const specialties = useMemo<string[]>(() => {
        const specialtiesFromData = MOCK_DOCTORS.map((doctor) => doctor.specialty);

        return [
            ALL_SPECIALTIES,
            ...Array.from(new Set(specialtiesFromData)),
        ];
    }, []);

    const filteredDoctors = useMemo<Doctor[]>(() => {
        const query = searchQuery.trim().toLowerCase();

        return MOCK_DOCTORS.filter((doctor) => {
            const matchesSpecialty =
                selectedSpecialty === ALL_SPECIALTIES ||
                doctor.specialty === selectedSpecialty;

            const matchesQuery =
                query.length === 0 ||
                doctor.name.toLowerCase().includes(query) ||
                doctor.specialty.toLowerCase().includes(query);

            return matchesSpecialty && matchesQuery;
        });
    }, [searchQuery, selectedSpecialty]);

    const handleBookPress = (doctorId: string): void => {
        navigation.navigate('DoctorDetail', { doctorId });
    };

    const renderDoctor: ListRenderItem<Doctor> = ({ item }) => {
        return (
            <View style={styles.card}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.doctorName} numberOfLines={1}>
                        {item.name}
                    </Text>

                    <Text style={styles.specialty} numberOfLines={1}>
                        {item.specialty}
                    </Text>

                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>
                            {item.experienceYears} yrs experience
                        </Text>

                        <View style={styles.dot} />

                        <Text style={styles.ratingText}>
                            ★ {formatRating(item.rating)}
                        </Text>
                    </View>

                    <View style={styles.footerRow}>
                        <Text style={styles.feeText}>
                            {formatFee(item.consultationFee)}
                        </Text>

                        <Pressable
                            style={({ pressed }) => [
                                styles.bookButton,
                                pressed ? styles.bookButtonPressed : undefined,
                            ]}
                            onPress={() => handleBookPress(item.id)}
                        >
                            <Text style={styles.bookButtonText}>Book</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Find a Doctor</Text>

                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name or specialty"
                        placeholderTextColor="#94A3B8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCorrect={false}
                        returnKeyType="search"
                    />
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsContainer}
                >
                    {specialties.map((specialty) => {
                        const isActive = specialty === selectedSpecialty;

                        return (
                            <Pressable
                                key={specialty}
                                style={[
                                    styles.chip,
                                    isActive ? styles.chipActive : undefined,
                                ]}
                                onPress={() => setSelectedSpecialty(specialty)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        isActive ? styles.chipTextActive : undefined,
                                    ]}
                                >
                                    {specialty}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            <FlatList
                data={filteredDoctors}
                keyExtractor={(item) => item.id}
                renderItem={renderDoctor}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateTitle}>No doctors found</Text>
                        <Text style={styles.emptyStateSubtitle}>
                            Try changing your search or specialty filter.
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 14,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#0F172A',
        paddingVertical: 0,
    },
    chipsContainer: {
        paddingRight: 20,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginRight: 8,
    },
    chipActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
    },
    chipTextActive: {
        color: '#FFFFFF',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexGrow: 1,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 16,
        marginBottom: 12,
    },
    avatarContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1D4ED8',
    },
    cardContent: {
        flex: 1,
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
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    metaText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#CBD5E1',
        marginHorizontal: 8,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#F59E0B',
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    feeText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0F172A',
    },
    bookButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    bookButtonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    bookButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
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

export default DoctorListScreen;