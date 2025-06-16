import { StyleSheet, useColorScheme, TouchableOpacity, Animated, View } from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme, useIsFocused, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import layar otentikasi dan splash screen
import SplashScreen from './app/layout/Splashscreen';
import Login from './app/Auth/Login';
import ResetPassword from './app/Auth/ResetPassword';

// Import layar untuk Tab Navigator
import DashboardScreen from './app/DashboardScreen/Dashboard';
import ManajemenMitraScreen from './app/DashboardScreen/ManajemenMitra';
import ManajemenProdukScreen from './app/DashboardScreen/ManajemenProduk';
import ProfileScreen from './app/DashboardScreen/Profile';

import './global.css';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Komponen untuk efek fade pada layar
function FadeScreen({ children }) {
  const isFocused = useIsFocused();
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFocused, opacity]);

  return (
    <Animated.View style={[styles.animatedContainer, { opacity }]}>
      {children}
    </Animated.View>
  );
}

// Komponen ikon untuk tab bar
const DashboardTabBarIcon = ({ focused, color }) => (
  <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
);
const MitraTabBarIcon = ({ focused, color }) => (
  <Ionicons name={focused ? 'business' : 'business-outline'} size={24} color={color} />
);
const ProdukTabBarIcon = ({ focused, color }) => (
  <Ionicons name={focused ? 'cube' : 'cube-outline'} size={24} color={color} />
);
const ProfileTabBarIcon = ({ focused, color }) => (
  <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
);

// Komponen Tab Navigator utama
function MainTabNavigator({ isDark }) {
  const renderDashboardScreen = useCallback(() => (
    <FadeScreen><DashboardScreen isDark={isDark} /></FadeScreen>
  ), [isDark]);

  const renderManajemenMitraScreen = useCallback(() => (
    <FadeScreen><ManajemenMitraScreen isDark={isDark} /></FadeScreen>
  ), [isDark]);

  const renderManajemenProdukScreen = useCallback(() => (
    <FadeScreen><ManajemenProdukScreen isDark={isDark} /></FadeScreen>
  ), [isDark]);

  const renderProfileScreen = useCallback(() => (
    <FadeScreen><ProfileScreen isDark={isDark} /></FadeScreen>
  ), [isDark]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Header akan di-handle oleh Stack Navigator
        tabBarActiveTintColor: '#FFAA01',
        tabBarInactiveTintColor: '#BEBEBE',
        tabBarStyle: {
          backgroundColor: isDark ? '#18181b' : '#fff',
          borderTopWidth: 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          paddingBottom: 6,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen name="Dashboard" component={renderDashboardScreen} options={{ tabBarIcon: DashboardTabBarIcon }} />
      <Tab.Screen name="Manajemen Mitra" component={renderManajemenMitraScreen} options={{ tabBarIcon: MitraTabBarIcon }} />
      <Tab.Screen name="Manajemen Produk" component={renderManajemenProdukScreen} options={{ tabBarIcon: ProdukTabBarIcon }} />
      <Tab.Screen name="Profil" component={renderProfileScreen} options={{ tabBarIcon: ProfileTabBarIcon }} />
    </Tab.Navigator>
  );
}

// Komponen App utama
export default function App() {
  const navigationRef = useRef(null);
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme === 'dark' ? 'dark' : 'light');
  const isDark = theme === 'dark';

  // Mendefinisikan tema terang dan gelap
  const MyTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#f2f2f2' } };
  const MyDarkTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: '#121212' } };

  // Fungsi untuk mendapatkan judul header berdasarkan route yang aktif
  const getHeaderTitle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Dashboard';
    switch (routeName) {
      case 'Manajemen Mitra': return 'Manajemen Mitra';
      case 'Manajemen Produk': return 'Manajemen Produk';
      case 'Profil': return 'Profil';
      case 'Dashboard':
      default:
        return 'Dashboard';
    }
  };

  return (
    <NavigationContainer ref={navigationRef} theme={isDark ? MyDarkTheme : MyTheme}>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen
          name="MainApp"
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerStyle: { backgroundColor: isDark ? '#18181b' : '#fff' },
            headerTitleStyle: { color: isDark ? '#fff' : '#18181b' },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => setTheme(isDark ? 'light' : 'dark')}
                style={styles.headerRightButton}
                accessibilityLabel="Toggle dark mode">
                <Ionicons name={isDark ? 'sunny' : 'moon'} size={24} color={isDark ? '#FFAA01' : '#18181b'} />
              </TouchableOpacity>
            ),
          })}
        >
          {() => <MainTabNavigator isDark={isDark} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    animatedContainer: {
        flex: 1,
    },
    headerRightButton: {
        marginRight: 16,
    },
});
