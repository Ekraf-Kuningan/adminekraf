// src/screens/Auth/ResetPasswordScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Impor yang sudah disesuaikan
import { authApi } from '../../lib/api';
import PopupTemplate from '../../components/PopUpTemplate';
import { useTheme } from '../Context/ThemeContext';

const ForgotPasswordScreen = ({ navigation }: { navigation: any }) => { // Nama komponen diubah agar lebih jelas
  const { isDark } = useTheme(); // Menggunakan hook tema kustom
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // --- STATE & HELPER UNTUK POPUP ---
  const [popup, setPopup] = useState({
    visible: false,
    theme: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: '',
    onClose: () => { },
    buttonText: 'OK',
  });

  const showPopup = (
    theme: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    buttonText: string = 'Mengerti',
    onCloseAction = () => { }
  ) => {
    setPopup({
      visible: true,
      theme,
      title,
      message,
      buttonText,
      onClose: () => {
        setPopup(prev => ({ ...prev, visible: false }));
        onCloseAction();
      },
    });
  };

  // Handler yang disesuaikan
  const handleRequestReset = async () => {
    if (!email.trim()) {
      showPopup('warning', 'Email Diperlukan', 'Mohon masukkan alamat email Anda.');
      return;
    }

    setLoading(true);

    try {
      // Panggil fungsi dari objek authApi dengan format yang benar
      const response = await authApi.forgotPassword({email});

      // Gunakan PopupTemplate untuk pesan sukses
      showPopup(
        'success',
        'Permintaan Terkirim,silakan periksa email Anda dan reset kata sandi Anda.',
        response.message,
        'Buka Gmail',
        () => {
            Linking.openURL('https://gmail.app.goo.gl');
            navigation.navigate('Login');
        } // Aksi navigasi setelah popup ditutup
      );

    } catch (error: any) {
      // Gunakan PopupTemplate untuk pesan error
      console.error(error);
      showPopup('error', 'Gagal', error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- JSX (Tampilan Visual) ---
  return (
    <SafeAreaView className={`flex-1 pt-2 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View className="p-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-8 self-start">
          <Icon name="arrow-back-outline" size={28} color={isDark ? '#F3F4F6' : '#374151'} />
        </TouchableOpacity>

        <Text className={`text-3xl font-bold mb-2 text-center ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
          Lupa Kata Sandi
        </Text>
        <Text className={`text-base mb-10 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Masukkan email Anda untuk menerima instruksi reset kata sandi.
        </Text>

        <Text className={`text-sm font-medium mb-2 ml-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          Alamat Email
        </Text>
        <TextInput
          className={`border rounded-lg p-4 mb-8 text-base ${isDark ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
          placeholder="Masukkan email disini"
          placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TouchableOpacity
          className={'rounded-lg py-4 flex-row justify-center items-center bg-[#FFAA01] active:opacity-80'}
          onPress={handleRequestReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-center font-semibold text-base">
              Kirim Instruksi
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Komponen Pop Up yang akan ditampilkan di atas segalanya */}
      <PopupTemplate
        visible={popup.visible}
        onClose={popup.onClose}
        theme={popup.theme}
        title={popup.title}
        message={popup.message}
        buttonText={popup.buttonText}
      />
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
