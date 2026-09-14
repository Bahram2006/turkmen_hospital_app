import type { Appointment } from '../types/appointment';

const createISODate = (daysFromNow: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString();
};

export const MOCK_APPOINTMENTS: readonly Appointment[] = [
    {
        id: 'apt-001',
        doctorId: 'doc-001',
        patientId: 'pat-001',
        patientName: 'John Doe',
        appointmentDate: createISODate(2),
        startTime: '09:00',
        endTime: '09:30',
        status: 'CONFIRMED',
        consultationType: 'ONLINE',
        reason: 'Follow-up consultation for blood pressure monitoring.',
        notes: 'Patient requested morning slot.',
        createdAt: createISODate(-5),
        doctor: {
            id: 'doc-001',
            name: 'Dr. Sarah Jenkins',
            specialty: 'Cardiology',
        },
    },
    {
        id: 'apt-002',
        doctorId: 'doc-002',
        patientId: 'pat-001',
        patientName: 'John Doe',
        appointmentDate: createISODate(5),
        startTime: '14:00',
        endTime: '14:45',
        status: 'PENDING',
        consultationType: 'IN_PERSON',
        reason: 'Annual skin checkup and mole evaluation.',
        createdAt: createISODate(-1),
        doctor: {
            id: 'doc-002',
            name: 'Dr. Omar Khalid',
            specialty: 'Dermatology',
        },
    },
    {
        id: 'apt-003',
        doctorId: 'doc-003',
        patientId: 'pat-001',
        patientName: 'John Doe',
        appointmentDate: createISODate(-3),
        startTime: '11:00',
        endTime: '11:30',
        status: 'COMPLETED',
        consultationType: 'ONLINE',
        reason: 'General wellness check and prescription renewal.',
        notes: 'Prescription sent to pharmacy.',
        createdAt: createISODate(-10),
        doctor: {
            id: 'doc-003',
            name: 'Dr. Emily Carter',
            specialty: 'General Practice',
        },
    },
    {
        id: 'apt-004',
        doctorId: 'doc-001',
        patientId: 'pat-001',
        patientName: 'John Doe',
        appointmentDate: createISODate(-7),
        startTime: '10:00',
        endTime: '10:30',
        status: 'CANCELLED',
        consultationType: 'ONLINE',
        reason: 'Chest pain evaluation.',
        cancelReason: 'Patient had a scheduling conflict.',
        createdAt: createISODate(-14),
        doctor: {
            id: 'doc-001',
            name: 'Dr. Sarah Jenkins',
            specialty: 'Cardiology',
        },
    },
    {
        id: 'apt-005',
        doctorId: 'doc-002',
        patientId: 'pat-001',
        patientName: 'John Doe',
        appointmentDate: createISODate(1),
        startTime: '16:00',
        endTime: '16:30',
        status: 'PENDING',
        consultationType: 'ONLINE',
        reason: 'Review recent lab results.',
        createdAt: createISODate(0),
        doctor: {
            id: 'doc-002',
            name: 'Dr. Omar Khalid',
            specialty: 'Dermatology',
        },
    },
];