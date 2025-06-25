import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Konfigurasi untuk setiap tema (warna & ikon default)
const themeConfig = {
  success: {
    color: 'yellow-400',
    icon: 'check-circle-outline',
  },
  error: {
    color: 'red-500',
    icon: 'close-circle-outline',
  },
  warning: {
    color: 'orange-400',
    icon: 'alert-circle-outline',
  },
  info: {
    color: 'blue-500',
    icon: 'information-outline',
  },
};

// Karena NativeWind/TailwindCSS tidak bisa membuat class secara dinamis (cth: `bg-${warna}`),
// kita perlu mendefinisikan nama class lengkap agar bisa dideteksi saat build.
// Ini adalah pattern yang umum digunakan.
const colorMap: Record<string, string> = {
    'bg-yellow-400': 'bg-[#F2A307]',
    'text-yellow-400': 'text-[#F2A307]',
    'bg-red-500': 'bg-red-500',
    'text-red-500': 'text-red-500',
    'bg-orange-400': 'bg-orange-400',
    'text-orange-400': 'text-orange-400',
    'bg-blue-500': 'bg-blue-500',
    'text-blue-500': 'text-blue-500',
};


/**
 * Komponen Template Pop Up yang Fleksibel
 * @param {object} props
 * @param {boolean} props.visible - State untuk menampilkan/menyembunyikan modal.
 * @param {() => void} props.onClose - Fungsi yang dipanggil saat tombol ditekan.
 * @param {'success' | 'error' | 'warning' | 'info'} [props.theme='info'] - Tema pop up untuk warna dan ikon default.
 * @param {string} props.title - Judul pesan pop up.
 * @param {string} props.message - Isi pesan pop up.
 * @param {string} [props.buttonText='Mengerti'] - Teks pada tombol.
 * @param {{name: string}} [props.customIcon] - Untuk menggunakan ikon kustom dari MaterialCommunityIcons.
 * @param {import('react-native').ImageSourcePropType} [props.customLogo] - Untuk menggunakan logo/gambar sendiri. Prioritas lebih tinggi dari ikon.
 */
const PopupTemplate = ({
  visible,
  onClose,
  theme = 'info',
  title,
  message,
  buttonText = 'Mengerti',
  customIcon,
  customLogo,
}: { visible: boolean; onClose: () => void; theme?: 'success' | 'error' | 'warning' | 'info'; title: string; message: string; buttonText?: string; customIcon?: { name: string; }; customLogo?: import('react-native').ImageSourcePropType; }) => {
  const currentTheme = themeConfig[theme] || themeConfig.info;

  // Ambil nama class dari map berdasarkan tema yang dipilih
  const headerBgClass = colorMap[`bg-${currentTheme.color}`] || 'bg-gray-400';
  const iconColorClass = colorMap[`text-${currentTheme.color}`] || 'text-gray-400';
  const buttonBgClass = colorMap[`bg-${currentTheme.color}`] || 'bg-gray-400';

  const renderIconOrLogo = () => {
    // Jika ada `customLogo`, tampilkan gambar
    if (customLogo) {
      return <Image source={customLogo} className="w-12 h-12" resizeMode="contain" />;
    }

    // Jika tidak, gunakan `customIcon` atau ikon default dari tema
    const iconName = customIcon?.name || currentTheme.icon;
    return <Icon name={iconName} size={48} className={iconColorClass} />;
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/40 px-4">
        <View className="w-full max-w-sm bg-white rounded-2xl shadow-lg">
          {/* Header Section dengan warna dinamis */}
          <View className={`h-24 rounded-t-2xl ${headerBgClass}`} />

          <View className="items-center px-6 pb-6">
            {/* Icon/Logo Wrapper */}
            <View className="bg-white p-4 rounded-full -mt-12 shadow-md">
              {renderIconOrLogo()}
            </View>

            {/* Konten Teks Dinamis */}
            <Text className="text-2xl font-bold text-gray-800 mt-5 text-center">
              {title}
            </Text>
            <Text className="text-base text-gray-500 text-center mt-2">
              {message}
            </Text>

            {/* Tombol Aksi Dinamis */}
            <TouchableOpacity
              className={`w-full py-3 mt-6 rounded-lg ${buttonBgClass}`}
              onPress={onClose}
              activeOpacity={0.8}>
              <Text className="text-white text-center font-bold text-lg">
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PopupTemplate;
