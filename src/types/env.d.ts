declare global {
    namespace NodeJS {
        interface ProcessEnv {
            EXPO_PUBLIC_API_URL?: string;
            EXPO_PUBLIC_WS_URL?: string;
            EXPO_PUBLIC_ENABLE_ANALYTICS?: string; // Env vars are always strings
            EXPO_PUBLIC_SENTRY_DSN?: string;
            NODE_ENV?: 'development' | 'production' | 'test';
        }
    }
}

// This empty export is required to make this file a module
export { };