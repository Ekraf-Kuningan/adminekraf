import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Pastikan file ini berada di dalam path yang terdaftar di tailwind.config.js
// Contoh: ./app/Auth/ResetPasswordScreen.tsx

const ResetPasswordScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Email tidak boleh kosong.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://ekraf.asepharyana.tech/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('Sukses', data.message, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  const containerBg = isDark ? 'bg-black' : 'bg-white';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-800';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-gray-900' : 'bg-white';
  const inputBorder = isDark ? 'border-gray-700' : 'border-gray-300';
  const placeholderColor = isDark ? '#6B7280' : '#9CA3AF';
  const iconColor = isDark ? '#F3F4F6' : '#374151';
  const buttonBg = isDark ? 'bg-yellow-600' : 'bg-yellow-500';

  return (
    <SafeAreaView className={`flex-1 pt-2 ${containerBg}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View className="p-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-8 self-start">
          <Icon name="arrow-back-outline" size={28} color={iconColor} />
        </TouchableOpacity>

        <Text className={`text-3xl font-bold mb-2 text-center ${textColor}`}>
          Reset Password
        </Text>
        <Text className={`text-sm mb-10 text-center ${subTextColor}`}>
          Password baru akan dikirimkan melalui email yang telah didaftarkan
        </Text>

        <Text className={`text-sm mb-1 ml-1 ${textColor}`}>Email</Text>
        <TextInput
          className={`border rounded-lg p-4 mb-8 text-base ${inputBorder} ${inputBg} ${textColor}`}
          placeholder="Masukkan email disini"
          placeholderTextColor={placeholderColor}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TouchableOpacity
          className={`rounded-lg py-4 flex-row justify-center items-center ${buttonBg}`}
          onPress={handleResetPassword}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-center font-semibold text-base">Kirim</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
