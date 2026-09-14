import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Appointment, AppointmentStatus } from '../types/appointment';
import { MOCK_APPOINTMENTS } from '../data/mockAppointments';

// ==========================================
// TYPES
// ==========================================

interface BookingPayload {
    doctorId: string;
    doctorName: string;
    specialty: string;
    appointmentDate: string; // ISO String
    startTime: string;       // HH:mm
    endTime: string;         // HH:mm
    reason: string;
    consultationType: 'ONLINE' | 'IN_PERSON';
}

interface AppointmentContextData {
    appointments: Appointment[];
    bookAppointment: (payload: BookingPayload) => void;
    updateAppointmentStatus: (id: string, status: AppointmentStatus, cancelReason?: string) => void;
    getDoctorAppointments: (doctorId: string) => Appointment[];
    getPatientAppointments: (patientId: string) => Appointment[];
}

const AppointmentContext = createContext<AppointmentContextData | undefined>(undefined);

// ==========================================
// PROVIDER
// ==========================================

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize with mock data
    const [appointments, setAppointments] = useState<Appointment[]>([...MOCK_APPOINTMENTS]);

    const bookAppointment = useCallback((payload: BookingPayload) => {
        const newAppointment: Appointment = {
            id: `apt-${Date.now()}`,
            doctorId: payload.doctorId,
            patientId: 'pat-001', // Mock logged-in patient ID
            patientName: 'John Doe', // Mock logged-in patient name
            appointmentDate: payload.appointmentDate,
            startTime: payload.startTime,
            endTime: payload.endTime,
            status: 'PENDING',
            consultationType: payload.consultationType,
            reason: payload.reason,
            createdAt: new Date().toISOString(),
            doctor: {
                id: payload.doctorId,
                name: payload.doctorName,
                specialty: payload.specialty,
            },
        };

        setAppointments((prev) => [newAppointment, ...prev]);
    }, []);

    const updateAppointmentStatus = useCallback(
        (id: string, status: AppointmentStatus, cancelReason?: string) => {
            setAppointments((prev) =>
                prev.map((apt) =>
                    apt.id === id
                        ? { ...apt, status, cancelReason: cancelReason || apt.cancelReason }
                        : apt
                )
            );
        },
        []
    );

    const getDoctorAppointments = useCallback(
        (doctorId: string) => appointments.filter((apt) => apt.doctorId === doctorId),
        [appointments]
    );

    const getPatientAppointments = useCallback(
        (patientId: string) => appointments.filter((apt) => apt.patientId === patientId),
        [appointments]
    );

    return (
        <AppointmentContext.Provider
            value={{
                appointments,
                bookAppointment,
                updateAppointmentStatus,
                getDoctorAppointments,
                getPatientAppointments,
            }}
        >
            {children}
        </AppointmentContext.Provider>
    );
};

// ==========================================
// HOOK
// ==========================================

export const useAppointments = (): AppointmentContextData => {
    const context = useContext(AppointmentContext);
    if (!context) {
        throw new Error('useAppointments must be used within an AppointmentProvider');
    }
    return context;
};