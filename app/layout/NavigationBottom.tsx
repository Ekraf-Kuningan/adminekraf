import { StyleSheet, useColorScheme, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// const ScreenPlaceholder = ({ title, isDark }: { title: string, isDark: boolean }) => (
//   <View style={[styles.screenContainer, isDark ? styles.screenContainerDark : styles.screenContainerLight]}>
//     <Text style={[styles.screenText, isDark ? styles.screenTextDark : styles.screenTextLight]}>{title}</Text>
//   </View>
// );
import DashboardScreen from '../DashboardScreen/Dashboard';
import ManajemenMitraScreen from '../DashboardScreen/ManajemenMitra';
import ManajemenProdukScreen from '../DashboardScreen/ManajemenProduk';
import ProfileScreen from '../DashboardScreen/Profile';
// const DashboardScreen = ({ isDark }: { isDark: boolean }) => <ScreenPlaceholder title="Dashboard" isDark={isDark} />;
// const ManajemenMitraScreen = ({ isDark }: { isDark: boolean }) => <ScreenPlaceholder title="Manajemen Mitra" isDark={isDark} />;
// const ManajemenProdukScreen = ({ isDark }: { isDark: boolean }) => <ScreenPlaceholder title="Manajemen Produk" isDark={isDark} />;
// const ProfileScreen = ({ isDark }: { isDark: boolean }) => <ScreenPlaceholder title="Profil" isDark={isDark} />;

function FadeScreen({ children }: { children: React.ReactNode }) {
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

const Tab = createBottomTabNavigator();

// Tab bar icon components moved outside NavigationBottom
const DashboardTabBarIcon = ({ focused, color }: { focused: boolean; color: string }) => (
  <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
);

const MitraTabBarIcon = ({ focused, color }: { focused: boolean; color: string }) => (
  <Ionicons name={focused ? 'business' : 'business-outline'} size={24} color={color} />
);

const ProdukTabBarIcon = ({ focused, color }: { focused: boolean; color: string }) => (
  <Ionicons name={focused ? 'cube' : 'cube-outline'} size={24} color={color} />
);

const ProfileTabBarIcon = ({ focused, color }: { focused: boolean; color: string }) => (
  <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
);

export default function NavigationBottom() {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(systemColorScheme === 'dark' ? 'dark' : 'light');
  const isDark = theme === 'dark';

  const renderHeaderRight = useCallback(() => (
    <TouchableOpacity
      onPress={() => setTheme(isDark ? 'light' : 'dark')}
      style={styles.headerRightButton}
      accessibilityLabel="Toggle dark mode">
      <Ionicons name={isDark ? 'sunny' : 'moon'} size={24} color={isDark ? '#FFAA01' : '#18181b'} />
    </TouchableOpacity>
  ), [isDark]);

  const renderDashboardScreen = useCallback(() => (
    <FadeScreen>
      <DashboardScreen isDark={isDark} />
    </FadeScreen>
  ), [isDark]);

  const renderManajemenMitraScreen = useCallback(() => (
    <FadeScreen>
      <ManajemenMitraScreen isDark={isDark} />
    </FadeScreen>
  ), [isDark]);

  const renderManajemenProdukScreen = useCallback(() => (
    <FadeScreen>
      <ManajemenProdukScreen isDark={isDark} />
    </FadeScreen>
  ), [isDark]);

  const renderProfileScreen = useCallback(() => (
    <FadeScreen>
      <ProfileScreen isDark={isDark} />
    </FadeScreen>
  ), [isDark]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#18181b' : '#fff',
        },
        headerTitleStyle: {
          color: isDark ? '#fff' : '#18181b',
          fontSize: 18,
        },
        headerRight: renderHeaderRight,
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
      <Tab.Screen
        name="Dashboard"
        options={{
          tabBarIcon: DashboardTabBarIcon,
        }}
      >
        {renderDashboardScreen}
      </Tab.Screen>
      <Tab.Screen
        name="Manajemen Mitra"
        options={{
          tabBarIcon: MitraTabBarIcon,
        }}>
        {renderManajemenMitraScreen}
      </Tab.Screen>
      <Tab.Screen
        name="Manajemen Produk"
        options={{
          tabBarIcon: ProdukTabBarIcon,
        }}>
        {renderManajemenProdukScreen}
      </Tab.Screen>
      <Tab.Screen
        name="Profil"
        options={{
          tabBarIcon: ProfileTabBarIcon,
        }}>
        {renderProfileScreen}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainerLight: {
    backgroundColor: '#f2f2f2',
  },
  screenContainerDark: {
    backgroundColor: '#121212',
  },
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  screenTextLight: {
    color: '#000',
  },
  screenTextDark: {
    color: '#fff',
  },
  headerRightButton: {
    marginRight: 16,
  },
});
