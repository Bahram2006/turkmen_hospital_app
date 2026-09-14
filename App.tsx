import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { AppointmentProvider } from './src/context/AppointmentContext';
import RootNavigator from './src/navigation/RootNavigator';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppointmentProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AppointmentProvider>
    </AuthProvider>
  );
};

export default App;