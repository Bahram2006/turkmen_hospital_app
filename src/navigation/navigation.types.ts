import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// ==========================================
// AUTH STACK
// ==========================================

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

// ==========================================
// ROUTE PARAMS
// ==========================================

export type DoctorDetailRouteParams = {
    doctorId: string;
};

export type AppointmentDetailRouteParams = {
    appointmentId: string;
};

// ==========================================
// PATIENT / APP STACK
// ==========================================

export type PatientStackParamList = {
    Home: undefined;
    DoctorList: undefined;
    DoctorDetail: DoctorDetailRouteParams;
    AppointmentList: undefined;
    AppointmentDetail: AppointmentDetailRouteParams;
};

export type AppStackParamList = PatientStackParamList;

// ==========================================
// SCREEN PROPS
// ==========================================

export type DoctorListScreenProps = NativeStackScreenProps<
    AppStackParamList,
    'DoctorList'
>;

export type DoctorDetailScreenProps = NativeStackScreenProps<
    AppStackParamList,
    'DoctorDetail'
>;

export type AppointmentListScreenProps = NativeStackScreenProps<
    AppStackParamList,
    'AppointmentList'
>;

export type AppointmentDetailScreenProps = NativeStackScreenProps<
    AppStackParamList,
    'AppointmentDetail'
>;