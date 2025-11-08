import React from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { PolkadotProvider } from './src/contexts/PolkadotContext';

export default function App() {
  return (
    <PolkadotProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </PolkadotProvider>
  );
}
