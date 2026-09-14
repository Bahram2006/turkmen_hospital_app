import type { Doctor } from './doctor';

// ==========================================
// APPOINTMENT STATUSES
// ==========================================

export type AppointmentStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'CANCELLED'
    | 'COMPLETED';

// ==========================================
// APPOINTMENT DOMAIN MODEL
// ==========================================

export interface Appointment {
    id: string;
    doctorId: string;
    patientId: string;
    patientName: string;
    appointmentDate: string; // ISO 8601 string
    startTime: string;       // HH:mm format
    endTime: string;         // HH:mm format
    status: AppointmentStatus;
    consultationType: 'ONLINE' | 'IN_PERSON';
    reason: string;
    notes?: string;
    cancelReason?: string;
    createdAt: string;       // ISO 8601 string
    doctor: Pick<Doctor, 'id' | 'name' | 'specialty'>;
}

// ==========================================
// STATUS THEME CONFIGURATION
// ==========================================

export interface StatusTheme {
    label: string;
    backgroundColor: string;
    textColor: string;
    icon: string;
}

export const APPOINTMENT_STATUS_THEME: Record<AppointmentStatus, StatusTheme> = {
    PENDING: {
        label: 'Pending',
        backgroundColor: '#FEF3C7',
        textColor: '#B45309',
        icon: '⏳',
    },
    CONFIRMED: {
        label: 'Confirmed',
        backgroundColor: '#DCFCE7',
        textColor: '#166534',
        icon: '✅',
    },
    CANCELLED: {
        label: 'Cancelled',
        backgroundColor: '#FEE2E2',
        textColor: '#B91C1C',
        icon: '❌',
    },
    COMPLETED: {
        label: 'Completed',
        backgroundColor: '#E0E7FF',
        textColor: '#3730A3',
        icon: '🏁',
    },
};