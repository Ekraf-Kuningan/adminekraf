// src/components/CustomPicker.tsx

import React, { useState } from 'react';
import { TouchableOpacity, Text, Modal, Pressable, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../app/Context/ThemeContext'; // Pastikan path ini benar
// Interface untuk item tidak berubah
interface PickerItem {
    label: string;
    value: any;
}

// Tipe untuk props yang disederhanakan
interface CustomPickerProps {
    items: PickerItem[];
    selectedValue: any;
    onValueChange: (value: any) => void;
    placeholder: string;
    disabled?: boolean; // <-- Prop baru untuk menonaktifkan picker
}

/**
 * Komponen Picker kustom yang sadar tema (theme-aware).
 * Menggunakan Modal untuk menampilkan pilihan item.
 */
export const CustomPicker = ({
    items,
    selectedValue,
    onValueChange,
    placeholder,
    disabled = false,
}: CustomPickerProps) => {
    // 1. Menggunakan hook tema secara internal
    const { isDark } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);

    // 2. Logika styling dienkapsulasi di dalam komponen
    const iconColor = isDark ? '#9CA3AF' : '#6B7280';
    const placeholderColor = isDark ? 'text-gray-400' : 'text-gray-500';
    const textColor = isDark ? 'text-white' : 'text-zinc-900';
    const inputBorderColor = isDark ? 'border-neutral-600' : 'border-gray-400';
    const inputBackgroundColor = isDark ? 'bg-neutral-800' : 'bg-white';
    const modalBackgroundColor = isDark ? 'bg-neutral-900' : 'bg-white';
    const modalHeaderBorder = isDark ? 'border-neutral-700' : 'border-gray-200';

    // Menemukan label dari item yang terpilih
    const selectedLabel = items.find(item => item.value === selectedValue)?.label || placeholder;

    const handleOpenPicker = () => {
        if (!disabled) {
            setModalVisible(true);
        }
    };

    const renderItem = ({ item }: { item: PickerItem }) => (
        <TouchableOpacity
            className="p-4 border-b border-gray-200 dark:border-neutral-700"
            onPress={() => {
                onValueChange(item.value);
                setModalVisible(false);
            }}
        >
            <Text className={`text-lg text-center ${textColor}`}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <TouchableOpacity
                onPress={handleOpenPicker}
                disabled={disabled}
                // 3. Styling dinamis berdasarkan state internal dan props
                className={`flex-row items-center justify-between border rounded-lg px-3 h-14 mb-4 
                    ${inputBorderColor} ${inputBackgroundColor} 
                    ${disabled ? 'opacity-50' : ''}`}
            >
                <Text className={`text-base ${selectedValue != null ? textColor : placeholderColor}`}>
                    {selectedLabel}
                </Text>
                <Icon name="chevron-down-outline" size={24} color={iconColor} />
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                {/* Overlay untuk menutup modal saat diklik */}
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    {/* Kontainer modal, event press di sini tidak akan menutup modal */}
                    <Pressable className={`w-4/5 max-w-xs rounded-xl shadow-lg overflow-hidden ${modalBackgroundColor}`}>
                        <Text className={`text-xl font-semibold p-4 text-center border-b ${modalHeaderBorder} ${textColor}`}>
                            {placeholder}
                        </Text>
                        <FlatList
                            data={items}
                            renderItem={renderItem}
                            keyExtractor={(item) => String(item.value)}
                            style={styles.flatList}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    flatList: {
        maxHeight: 300, // Batasi tinggi list agar tidak terlalu panjang
    },
});
