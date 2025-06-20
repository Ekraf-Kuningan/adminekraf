import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

type UserData = {
  username?: string;
  level?: string;
  nama_user?: string;
  email?: string;
  // add other fields if needed
};

const ProfileScreen = ({ isDark }: { isDark: boolean }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Define your navigation param list type
  type RootStackParamList = {
    Login: undefined;
    // ...add other routes if needed
  };

  const navigation = useNavigation<import('@react-navigation/native').NavigationProp<RootStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          setError(null);
          setIsLoading(true);
          const jsonValue = await AsyncStorage.getItem('userData');
          if (jsonValue !== null) {
            const parsedData = JSON.parse(jsonValue);
            setUserData(parsedData);
          }
        } catch (e) {
          setError('Gagal memuat data pengguna.');
          console.error('Failed to fetch user data from storage', e);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              navigation.navigate('Login');
            } catch (e) {
              console.error('Failed to clear user data', e);
              Alert.alert('Error', 'Gagal untuk logout.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className={`flex-1 justify-center items-center ${isDark ? 'bg-zinc-900' : 'bg-gray-100'}`}>
        <ActivityIndicator size="large" color="#FFAA01" />
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 justify-center items-center p-4 ${isDark ? 'bg-zinc-900' : 'bg-gray-100'}`}>
        <Text className="text-lg text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-zinc-900' : 'bg-gray-100'}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View className="bg-yellow-400 h-48 rounded-bl-[60px] rounded-br-[60px] w-full absolute top-0" />

      <View className="items-center mt-20">
        <View className={`w-36 h-36 rounded-full items-center justify-center shadow-lg ${isDark ? 'bg-zinc-900' : 'bg-gray-100'}`}>
          <Icon name="user" size={80} color={isDark ? '#E5E7EB' : '#111827'} />
        </View>

        <Text className={`text-3xl font-bold mt-4 capitalize ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          {userData?.username || 'Username'}
        </Text>
        <Text className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {userData?.level || 'Level'}
        </Text>
      </View>

      <View className={`mx-8 mt-8 p-5 rounded-2xl border shadow-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <View className={`flex-row justify-between py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Nama Lengkap</Text>
          <Text className={`text-base font-semibold capitalize ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {userData?.nama_user || 'Nama Pengguna'}
          </Text>
        </View>
        <View className="flex-row justify-between py-3">
          <Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email</Text>
          <Text className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {userData?.email || 'email@contoh.com'}
          </Text>
        </View>
      </View>

      <View className="mx-8 mt-10">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-600 py-4 rounded-xl shadow-md"
        >
          <Text className="text-white text-center font-bold text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
