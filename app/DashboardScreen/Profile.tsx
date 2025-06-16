import { StyleSheet, Text, View, StatusBar,SafeAreaView } from 'react-native';
import React from 'react';

export default function ProdukData({ isDark }: { isDark: boolean }) {
  return (
    <SafeAreaView className={`flex-1 items-center justify-center ${isDark ? 'bg-black' : 'bg-white'}`}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#18181b' : '#fff'} />
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Dashboard</Text>
          {/* Tambahkan konten dashboard lain di sini, gunakan className dinamis untuk warna */}
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
