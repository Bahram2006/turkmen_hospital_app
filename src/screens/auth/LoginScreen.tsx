import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { useAuth } from '../../context/AuthContext';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const { login } = useAuth();

    const handleMockLogin = async () => {
        try {
            // Mock data matching our UserInfo interface
            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token';
            const mockUser = {
                id: 'uuid-1234-5678',
                fullName: 'Dr. Sarah Jenkins',
                email: 'sarah@clinik.com',
                role: 'DOCTOR' as const,
            };

            await login(mockToken, mockUser);
        } catch (error) {
            Alert.alert('Error', 'Failed to log in. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Clinik</Text>
            <Text style={styles.subtitle}>Telemedicine Platform</Text>

            <TouchableOpacity style={styles.button} onPress={handleMockLogin}>
                <Text style={styles.buttonText}>Mock Login (Doctor)</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.linkText}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#FFFFFF' },
    title: { fontSize: 32, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#64748B', marginBottom: 48 },
    button: { width: '100%', backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    linkButton: { padding: 8 },
    linkText: { color: '#2563EB', fontSize: 14, fontWeight: '500' },
});

export default LoginScreen;