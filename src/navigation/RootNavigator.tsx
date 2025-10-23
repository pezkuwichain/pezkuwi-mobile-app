import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Auth Screens
import LanguageSelectionScreen from '../screens/Auth/LanguageSelectionScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';

// Main App
import BottomTabNavigator from './BottomTabNavigator';

// Additional Screens
import IdentityScreen from '../screens/Identity/IdentityScreen';
import EducationScreen from '../screens/Education/EducationScreen';
import BusinessScreen from '../screens/Business/BusinessScreen';
import ExchangeScreen from '../screens/Exchange/ExchangeScreen';

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

        {/* Additional Screens */}
        <Stack.Screen name="Identity" component={IdentityScreen} />
        <Stack.Screen name="Education" component={EducationScreen} />
        <Stack.Screen name="Business" component={BusinessScreen} />
        <Stack.Screen name="Exchange" component={ExchangeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

