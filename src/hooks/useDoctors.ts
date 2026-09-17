import { useState, useEffect } from 'react';
import { apiClient, ClinikAxiosError } from '../services/api';
import { Doctor } from '../types/doctor';

export const useDoctors = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDoctors = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Thanks to our generic wrapper, `response.data.data` is strictly typed as Doctor[]
            const response = await apiClient.get<Doctor[]>('/doctors');

            setDoctors(response.data.data);
        } catch (err: any) {
            // err is our normalized error object from the interceptor
            setError(err.message || 'Failed to fetch doctors');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    return { doctors, isLoading, error, refetch: fetchDoctors };
};