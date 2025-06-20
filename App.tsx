import {
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, { useCallback, ReactNode } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useIsFocused,
  getFocusedRouteNameFromRoute,
  RouteProp,
  ParamListBase,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeProvider, useTheme } from './app/Context/ThemeContext';

import SplashScreen from './app/layout/Splashscreen';
import Login from './app/Auth/Login';
import ResetPassword from './app/Auth/ResetPassword';
import DashboardScreen from './app/DashboardScreen/Dashboard';
import ManajemenMitraScreen from './app/DashboardScreen/ManajemenMitra';
import ManajemenProdukScreen from './app/DashboardScreen/ManajemenProduk';
import ProfileScreen from './app/DashboardScreen/Profile';
import AddProdukScreen from './app/DashboardScreen/AddProduk';
import EditMitraScreen from './app/Forms/EditMitraScreen';

import './global.css';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

interface FadeScreenProps {
  children: ReactNode;
}

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

function FadeScreen({ children }: FadeScreenProps) {
  const isFocused = useIsFocused();
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: isFocused ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isFocused, opacity]);

  return (
    <Animated.View style={[styles.animatedContainer, { opacity }]}>
      {children}
    </Animated.View>
  );
}

const DashboardTabBarIcon = ({ focused, color }: TabBarIconProps) => (
  <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
);
const MitraTabBarIcon = ({ focused, color }: TabBarIconProps) => (
  <Ionicons name={focused ? 'business' : 'business-outline'} size={24} color={color} />
);
const ProdukTabBarIcon = ({ focused, color }: TabBarIconProps) => (
  <Ionicons name={focused ? 'cube' : 'cube-outline'} size={24} color={color} />
);
const ProfileTabBarIcon = ({ focused, color }: TabBarIconProps) => (
  <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
);
const AddProdukTabBarIcon = ({ focused, color }: TabBarIconProps) => (
  <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={24} color={color} />
);

const HeaderThemeToggleButton = () => {
    const { isDark, toggleTheme } = useTheme();
    return (
        <TouchableOpacity
            onPress={toggleTheme}
            style={styles.headerRightButton}
            accessibilityLabel="Toggle dark mode">
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={24} color={isDark ? '#FFAA01' : '#18181b'} />
        </TouchableOpacity>
    );
};

function MainTabNavigator() {
  const { isDark } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
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
      <Tab.Screen name="Dashboard" options={{ tabBarIcon: DashboardTabBarIcon }}>
        {() => <FadeScreen><DashboardScreen /></FadeScreen>}
      </Tab.Screen>
      <Tab.Screen name="Manajemen Mitra" options={{ tabBarIcon: MitraTabBarIcon }}>
        {() => <FadeScreen><ManajemenMitraScreen /></FadeScreen>}
      </Tab.Screen>
      <Tab.Screen name="Add Produk" options={{ tabBarIcon: AddProdukTabBarIcon }}>
        {() => <FadeScreen><AddProdukScreen /></FadeScreen>}
      </Tab.Screen>
      <Tab.Screen name="Manajemen Produk" options={{ tabBarIcon: ProdukTabBarIcon }}>
        {() => <FadeScreen><ManajemenProdukScreen /></FadeScreen>}
      </Tab.Screen>
      <Tab.Screen name="Profil" options={{ tabBarIcon: ProfileTabBarIcon }}>
        {() => <FadeScreen><ProfileScreen /></FadeScreen>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function getHeaderTitle(route: RouteProp<ParamListBase, 'MainApp'>) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Dashboard';
    switch (routeName) {
        case 'Manajemen Mitra': return 'Manajemen Mitra';
        case 'Manajemen Produk': return 'Manajemen Produk';
        case 'Add Produk': return 'Tambah Produk';
        case 'Profil': return 'Profil';
        case 'Dashboard':
        default:
            return 'Dashboard';
    }
}

function AppContent() {
  const { isDark } = useTheme();

  const MyTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#f2f2f2' } };
  const MyDarkTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: '#121212' } };

  const renderHeaderRight = useCallback(() => <HeaderThemeToggleButton />, []);

  return (
    <NavigationContainer theme={isDark ? MyDarkTheme : MyTheme}>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen
          name="MainApp"
          component={MainTabNavigator}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerStyle: { backgroundColor: isDark ? '#18181b' : '#fff' },
            headerTitleStyle: { color: isDark ? '#fff' : '#18181b' },
            headerRight: renderHeaderRight,
            headerShadowVisible: false,
          })}
        />
        <Stack.Screen
            name="EditMitra"
            component={EditMitraScreen}
            options={{
                headerShown: true,
                headerTitle: 'Edit Mitra',
                headerStyle: { backgroundColor: isDark ? '#18181b' : '#fff' },
                headerTitleStyle: { color: isDark ? '#fff' : '#18181b' },
                headerTintColor: isDark ? '#fff' : '#18181b',
            }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
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