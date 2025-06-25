import { Text, StatusBar,SafeAreaView } from 'react-native';
import React from 'react';
import { useTheme } from '../Context/ThemeContext';

export default function ProdukData() {
  const { isDark } = useTheme();
  return (
    <SafeAreaView className={`flex-1 items-center justify-center ${isDark ? 'bg-black' : 'bg-white'}`}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#18181b' : '#fff'} />
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Dashboard</Text>
          {/* Tambahkan konten dashboard lain di sini, gunakan className dinamis untuk warna */}
        </SafeAreaView>
  );
}

