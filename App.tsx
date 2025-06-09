import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './app/Splashscreen';
import Login from './app/Auth/Login';
// import NavigationBottom from './components/NavigationBottom';
import {  } from 'react-native';
import ResetPassword from './app/Auth/ResetPassword';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
   <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown: false,animation: 'fade'}}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} options={{headerShown: false}} />
            <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
            {/* <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />
            <Stack.Screen name="NavigationBottom" component={NavigationBottom} options={{headerShown: false}} /> */}
        </Stack.Navigator>
   </NavigationContainer>
  )
}

const styles = StyleSheet.create({})