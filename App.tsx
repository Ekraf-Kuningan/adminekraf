import {
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, { useState, useRef, useCallback, ReactNode } from 'react';
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

// Import screens
import SplashScreen from './app/layout/Splashscreen';
import Login from './app/Auth/Login';
import ResetPassword from './app/Auth/ResetPassword';
import DashboardScreen from './app/DashboardScreen/Dashboard';
import ManajemenMitraScreen from './app/DashboardScreen/ManajemenMitra';
import ManajemenProdukScreen from './app/DashboardScreen/ManajemenProduk';
import ProfileScreen from './app/DashboardScreen/Profile';
import AddProdukScreen from './app/DashboardScreen/AddProduk';

import './global.css';

// Define stack and tab navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Define prop types for components
interface FadeScreenProps {
  children: ReactNode;
}

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

interface MainTabNavigatorProps {
  isDark: boolean;
}

interface HeaderThemeToggleButtonProps {
  isDark: boolean;
  onPress: () => void;
}

// --- Reusable Components ---

// FadeScreen: Component for fade-in/out animation on screen focus
function FadeScreen({ children }: FadeScreenProps) {
  const isFocused = useIsFocused();
  const opacity = useRef(new Animated.Value(0)).current;

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

// --- Tab Bar Icons ---
// Note: Size is automatically provided by the navigator, but we don't use it here.
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

// HeaderThemeToggleButton: Moved outside the App component to prevent re-creation on every render
const HeaderThemeToggleButton = ({ isDark, onPress }: HeaderThemeToggleButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.headerRightButton}
    accessibilityLabel="Toggle dark mode">
    <Ionicons name={isDark ? 'sunny' : 'moon'} size={24} color={isDark ? '#FFAA01' : '#18181b'} />
  </TouchableOpacity>
);

// --- Navigators ---

// MainTabNavigator: The bottom tab navigator component
function MainTabNavigator({ isDark }: MainTabNavigatorProps) {
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
        {() => <FadeScreen><DashboardScreen isDark={isDark} /></FadeScreen>}
      </Tab.Screen>
      <Tab.Screen name="Manajemen Mitra" options={{ tabBarIcon: MitraTabBarIcon }}>
        {() => <FadeScreen><ManajemenMitraScreen isDark={isDark} /></FadeScreen>}
      </Tab.Screen>
      <Tab.Screen name="Add Produk" options={{ tabBarIcon: AddProdukTabBarIcon }}>
        {() => <FadeScreen><AddProdukScreen isDark={isDark} /></FadeScreen>}
      </Tab.Screen>
      <Tab.Screen name="Manajemen Produk" options={{ tabBarIcon: ProdukTabBarIcon }}>
        {() => <FadeScreen><ManajemenProdukScreen isDark={isDark} /></FadeScreen>}
      </Tab.Screen>
      <Tab.Screen name="Profil" options={{ tabBarIcon: ProfileTabBarIcon }}>
        {() => <FadeScreen><ProfileScreen isDark={isDark} /></FadeScreen>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// --- Main App Component ---
export default function App() {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme === 'dark' ? 'dark' : 'light');
  const isDark = theme === 'dark';

  // Custom themes
  const MyTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#f2f2f2' } };
  const MyDarkTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: '#121212' } };

  // Function to get header title from the route
  const getHeaderTitle = (route: RouteProp<ParamListBase, 'MainApp'>) => {
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

  // Memoized theme toggle function
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // Memoized headerRight component to avoid redefining on every render
  const renderHeaderRight = useCallback(
    () => <HeaderThemeToggleButton isDark={isDark} onPress={toggleTheme} />,
    [isDark, toggleTheme]
  );

  return (
    <NavigationContainer theme={isDark ? MyDarkTheme : MyTheme}>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen
          name="MainApp"
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerStyle: { backgroundColor: isDark ? '#18181b' : '#fff' },
            headerTitleStyle: { color: isDark ? '#fff' : '#18181b' },
            headerRight: renderHeaderRight,
          })}
        >
          {() => <MainTabNavigator isDark={isDark} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
  },
  headerRightButton: {
    marginRight: 16,
  },
});
