export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface DoctorBrief {
    id: string;
    fullName: string;
    specialty: string;
    avatarUrl?: string;
}

export interface Appointment {
    id: string;
    appointmentDate: string; // ISO 8601
    status: AppointmentStatus;
    notes?: string;
    doctor: DoctorBrief;
}

export interface DashboardStats {
    totalAppointments: number;
    upcomingCount: number;
    completedCount: number;
}

// Matches NestJS ApiSuccessResponse<T> wrapper
export interface DashboardData {
    stats: DashboardStats;
    upcomingAppointments: Appointment[];
}