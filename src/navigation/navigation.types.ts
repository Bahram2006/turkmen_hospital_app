import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// ==========================================
// AUTH STACK
// ==========================================

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

// ==========================================
// PATIENT / APP STACK
// ==========================================

export type DoctorDetailRouteParams = {
    doctorId: string;
};

export type PatientStackParamList = {
    Home: undefined;
    DoctorList: undefined;
    DoctorDetail: DoctorDetailRouteParams;
};

/**
 * For now, AppStack and PatientStack are identical.
 *
 * Later, if you split Doctor, Admin, or Patient flows into nested stacks,
 * AppStackParamList can become the parent stack param list while
 * PatientStackParamList remains scoped to the patient flow.
 */
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