import { ExpoConfig, ConfigContext } from 'expo/config';

// Helper to safely get env vars and fail fast during build if missing
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    // Fail the build early rather than shipping a broken app
    throw new Error(`Environment variable ${key} is not defined.`);
  }
  return value;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  // Determine environment based on EAS_BUILD_PROFILE or fallback to development
  const environment = process.env.APP_ENV || process.env.EAS_BUILD_PROFILE || 'development';
  const isProd = environment === 'production';

  return {
    ...config,
    name: isProd ? 'Clinik' : 'Clinik (Dev)',
    slug: 'clinik',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'clinik',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: isProd ? 'com.clinik.app' : 'com.clinik.app.dev',
      infoPlist: {
        NSCameraUsageDescription: 'Clinik needs camera access for telemedicine video calls.',
        NSMicrophoneUsageDescription: 'Clinik needs microphone access for telemedicine consultations.',
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: isProd ? 'com.clinik.app' : 'com.clinik.app.dev',
      permissions: [
        'android.permission.CAMERA',
        'android.permission.RECORD_AUDIO',
        'android.permission.INTERNET',
      ],
    },
    plugins: [
      'expo-router', // If using expo-router
      'expo-secure-store',
      [
        'expo-camera',
        {
          cameraPermission: 'Allow Clinik to access your camera for video consultations.',
        },
      ],
    ],
    extra: {
      // You can still pass non-EXPO_PUBLIC variables here IF they are 
      // resolved at build time via process.env, but EXPO_PUBLIC_ is preferred.
      eas: {
        projectId: 'your-eas-project-id-here',
      },
    },
  };
};