import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Auth Screens
import LanguageSelectionScreen from '../screens/Auth/LanguageSelectionScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';

// Main App
import BottomTabNavigator from './BottomTabNavigator';

// Identity & KYC Screens
import IdentityKYCFormScreen from '../screens/Identity/IdentityKYCFormScreen';
import CitizenCardScreen from '../screens/Identity/CitizenCardScreen';

// Additional Screens
import EducationScreen from '../screens/Education/EducationScreen';
import BusinessScreen from '../screens/Business/BusinessScreen';
import ExchangeScreen from '../screens/Exchange/ExchangeScreen';
import ReferralScreen from '../screens/Referral/ReferralScreen';
import QRScannerScreen from '../screens/Home/QRScannerScreen';
import NotificationsScreen from '../screens/Home/NotificationsScreen';
import RewardsScreen from '../screens/Rewards/RewardsScreen';
import TrustScoreScreen from '../screens/Profile/TrustScoreScreen';
import WalletOnboardingScreen from '../screens/Wallet/WalletOnboardingScreen';
import CreateWalletScreen from '../screens/Wallet/CreateWalletScreen';
import ImportWalletScreen from '../screens/Wallet/ImportWalletScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LanguageSelection"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Auth Flow */}
        <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* Main App */}
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

        {/* Identity & KYC */}
        <Stack.Screen name="IdentityKYCForm" component={IdentityKYCFormScreen} />
        <Stack.Screen name="CitizenCard" component={CitizenCardScreen} />

        {/* Additional Screens */}
        <Stack.Screen name="Education" component={EducationScreen} />
        <Stack.Screen name="Business" component={BusinessScreen} />
        <Stack.Screen name="Exchange" component={ExchangeScreen} />
        <Stack.Screen name="Referral" component={ReferralScreen} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Rewards" component={RewardsScreen} />
        <Stack.Screen name="TrustScore" component={TrustScoreScreen} />
        <Stack.Screen name="WalletOnboarding" component={WalletOnboardingScreen} />
        <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
        <Stack.Screen name="ImportWallet" component={ImportWalletScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Add Ministries screen to imports and stack
