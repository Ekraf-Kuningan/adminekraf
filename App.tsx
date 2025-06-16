import { StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './app/Splashscreen';
import Login from './app/Auth/Login';
import ResetPassword from './app/Auth/ResetPassword';


import './global.css';

const Stack = createNativeStackNavigator();

export default function App() {
  const navigationRef = useRef(null);


  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown: false, animation: 'fade'}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const styles = StyleSheet.create({});
