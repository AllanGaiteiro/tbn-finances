import React from 'react';
import { LoginScreen } from '../screens/LoginScreen /LoginScreen ';
import { SignUpScreen } from '../screens/SignUpScreen/SignUpScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export const Stack = createNativeStackNavigator();

export function AuthNavigator() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
  );
}
