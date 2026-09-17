import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';

interface UseApiState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Generic hook for fetching data using our typed apiClient.
 * Includes automatic cleanup and safe state updates.
 */
export function useApi<T>(endpoint: string): UseApiState<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (isMounted: { current: boolean }) => {
        setIsLoading(true);
        setError(null);

        try {
            // apiClient.get returns AxiosResponse<ApiSuccessResponse<T>>
            // So the actual payload is in response.data.data
            const response = await apiClient.get<T>(endpoint);

            if (isMounted.current) {
                setData(response.data.data);
            }
        } catch (err: any) {
            if (isMounted.current) {
                // Normalized error from our Axios interceptor
                const message = err?.message || 'An unexpected error occurred';
                setError(message);
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    }, [endpoint]);

    useEffect(() => {
        const isMounted = { current: true };
        fetchData(isMounted);

        return () => {
            isMounted.current = false; // Prevent state updates on unmounted components
        };
    }, [fetchData]);

    const refetch = useCallback(async () => {
        const isMounted = { current: true };
        await fetchData(isMounted);
    }, [fetchData]);

    return { data, isLoading, error, refetch };
}