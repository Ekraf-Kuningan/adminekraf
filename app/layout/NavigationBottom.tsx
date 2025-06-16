import { StyleSheet, Text, View, useColorScheme, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ScreenPlaceholder = ({ title, isDark }: { title: string, isDark: boolean }) => (
  <View style={[styles.screenContainer, { backgroundColor: isDark ? '#121212' : '#f2f2f2' }]}>
    <Text style={[styles.screenText, { color: isDark ? '#fff' : '#000' }]}>{title}</Text>
  </View>
);

const DashboardScreen = ({ isDark }: { isDark: boolean }) => <ScreenPlaceholder title="Dashboard" isDark={isDark} />;
const ProdukDataScreen = ({ isDark }: { isDark: boolean }) => <ScreenPlaceholder title="Produk" isDark={isDark} />;
const NotificationScreen = ({ isDark }: { isDark: boolean }) => <ScreenPlaceholder title="Notifikasi" isDark={isDark} />;
const ProfileScreen = ({ isDark }: { isDark: boolean }) => <ScreenPlaceholder title="Profil" isDark={isDark} />;

function FadeScreen({ children, isDark }: { children: React.ReactNode, isDark: boolean }) {
  const isFocused = useIsFocused();
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: isFocused ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isFocused, opacity]);

  if (isDark) {
    return <>{children}</>;
  }

  return (
    <Animated.View style={[styles.animatedContainer, { opacity }]}>
      {children}
    </Animated.View>
  );
}


const Tab = createBottomTabNavigator();

export default function NavigationBottom() {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(systemColorScheme === 'dark' ? 'dark' : 'light');
  const isDark = theme === 'dark';

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
        headerRight: () => (
          <TouchableOpacity
            onPress={() => setTheme(isDark ? 'light' : 'dark')}
            style={{ marginRight: 16 }}
            accessibilityLabel="Toggle dark mode">
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={24} color={isDark ? '#FFAA01' : '#18181b'} />
          </TouchableOpacity>
        ),
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
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      >
        {() => (
          <FadeScreen isDark={isDark}>
            <DashboardScreen isDark={isDark} />
          </FadeScreen>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Produk"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'cube' : 'cube-outline'} size={24} color={color} />
          )
        }}>
        {() => (
          <FadeScreen isDark={isDark}>
            <ProdukDataScreen isDark={isDark} />
          </FadeScreen>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Notifikasi"
        options={{
          tabBarLabel: 'Notifikasi',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={24} color={color} />
          )
        }}>
        {() => (
          <FadeScreen isDark={isDark}>
            <NotificationScreen isDark={isDark} />
          </FadeScreen>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Profil"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          )
        }}>
        {() => (
          <FadeScreen isDark={isDark}>
            <ProfileScreen isDark={isDark} />
          </FadeScreen>
        )}
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
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
