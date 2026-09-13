import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
    navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Registration form will go here.</Text>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>← Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#FFFFFF' },
    title: { fontSize: 24, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
    subtitle: { fontSize: 14, color: '#64748B', marginBottom: 32 },
    backButton: { padding: 12, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8 },
    backButtonText: { color: '#475569', fontSize: 14, fontWeight: '600' },
});

export default RegisterScreen;