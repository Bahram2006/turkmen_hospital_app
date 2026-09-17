import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'clinik_jwt_token';
const REFRESH_TOKEN_KEY = 'clinik_refresh_token';

export const SecureStorage = {
    async getToken(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(TOKEN_KEY);
        } catch (error) {
            console.error('[SecureStorage] Failed to get token:', error);
            return null;
        }
    },

    async saveToken(token: string): Promise<void> {
        try {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        } catch (error) {
            console.error('[SecureStorage] Failed to save token:', error);
        }
    },

    async removeToken(): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('[SecureStorage] Failed to remove token:', error);
        }
    },
};