// app/Context/ThemeContext.js

import React, { createContext, useContext } from 'react';
// Impor useColorScheme dari React Native untuk fallback awal
import { useColorScheme as useDeviceColorScheme } from 'react-native';
// Impor useColorScheme dari NativeWind sebagai controller utama
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

type ThemeContextType = {
    isDark: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    // 1. Dapatkan controller tema dari NativeWind
    const { colorScheme, setColorScheme } = useNativeWindColorScheme();

    // 2. Dapatkan tema sistem sebagai fallback saat aplikasi pertama kali dimuat
    const deviceColorScheme = useDeviceColorScheme();

    // 3. Tentukan apakah mode gelap aktif
    //    - Jika ada pilihan manual (colorScheme bukan 'system'), gunakan itu.
    //    - Jika tidak, gunakan tema dari device.
    const isDark =
        colorScheme === 'dark' ||
        (colorScheme === undefined && deviceColorScheme === 'dark');

    // 4. Buat fungsi toggle yang akan mengontrol NativeWind
    const toggleTheme = () => {
        // setColorScheme akan secara otomatis menyimpan pilihan pengguna
        const newScheme = isDark ? 'light' : 'dark';
        setColorScheme(newScheme);
    };

    // 5. Sediakan `isDark` dan `toggleTheme` ke seluruh aplikasi
    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook useTheme tetap sama
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme harus digunakan di dalam ThemeProvider');
    }
    return context;
};
