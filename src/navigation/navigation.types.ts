import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';

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

export type DoctorAppointmentDetailRouteParams = {
    appointmentId: string;
};

// ==========================================
// PATIENT STACK
// ==========================================

export type PatientStackParamList = {
    Home: undefined;
    DoctorList: undefined;
    DoctorDetail: DoctorDetailRouteParams;
    AppointmentList: undefined;
    AppointmentDetail: AppointmentDetailRouteParams;
};

// ==========================================
// DOCTOR STACK (NEW)
// ==========================================

export type DoctorStackParamList = {
    DoctorDashboard: undefined;
    DoctorAppointmentList: undefined;
    DoctorAppointmentDetail: DoctorAppointmentDetailRouteParams;
};

// ==========================================
// APP STACK (PARENT)
// ==========================================

export type AppStackParamList = {
    PatientFlow: NavigatorScreenParams<PatientStackParamList> | undefined;
    DoctorFlow: NavigatorScreenParams<DoctorStackParamList> | undefined;
};

// ==========================================
// SCREEN PROPS
// ==========================================

// Patient Props
export type DoctorListScreenProps = NativeStackScreenProps<PatientStackParamList, 'DoctorList'>;
export type DoctorDetailScreenProps = NativeStackScreenProps<PatientStackParamList, 'DoctorDetail'>;
export type AppointmentListScreenProps = NativeStackScreenProps<PatientStackParamList, 'AppointmentList'>;
export type AppointmentDetailScreenProps = NativeStackScreenProps<PatientStackParamList, 'AppointmentDetail'>;

// Doctor Props
export type DoctorDashboardScreenProps = NativeStackScreenProps<DoctorStackParamList, 'DoctorDashboard'>;
export type DoctorAppointmentListScreenProps = NativeStackScreenProps<DoctorStackParamList, 'DoctorAppointmentList'>;
export type DoctorAppointmentDetailScreenProps = NativeStackScreenProps<DoctorStackParamList, 'DoctorAppointmentDetail'>;