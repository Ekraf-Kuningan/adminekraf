// screens/admin/ManajemenKategoriScreen.tsx

import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

import { useTheme } from '../Context/ThemeContext';
import { masterDataApi, kategoriUsahaApi, uploaderApi } from '../../lib/api';
import { KategoriUsaha, KategoriUsahaPayload } from '../../lib/types';

/**
 * Komponen Kartu untuk setiap Kategori
 */
const CategoryCard = ({ category, onEdit, onDelete }: { category: KategoriUsaha, onEdit: () => void, onDelete: () => void }) => (
  <View className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm mb-4 flex-row items-center p-4">
    <Image
      source={{ uri: category.image ?? 'https://placehold.co/100x100/e2e8f0/e2e8f0?text=Icon' }}
      className="w-16 h-16 rounded-lg mr-4 bg-gray-200"
    />
    <Text className="flex-1 text-lg font-semibold text-gray-800 dark:text-gray-100">{category.name}</Text>
    <TouchableOpacity onPress={onEdit} className="p-2">
      <Icon name="edit-2" size={20} color="#6B7280" />
    </TouchableOpacity>
    <TouchableOpacity onPress={onDelete} className="p-2">
      <Icon name="trash-2" size={20} color="#EF4444" />
    </TouchableOpacity>
  </View>
);

/**
 * Layar Utama Manajemen Kategori
 */
const ManajemenKategoriScreen = () => {
  const { isDark } = useTheme();
  const [categories, setCategories] = useState<KategoriUsaha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk Modal Form
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<KategoriUsaha | null>(null);
  const [formData, setFormData] = useState<KategoriUsahaPayload>({ name: '', image: '' });
  const [imageAsset, setImageAsset] = useState<Asset | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await masterDataApi.getBusinessCategories();
      setCategories(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [fetchCategories])
  );

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentCategory(null);
    setFormData({ name: '', image: '' });
    setImageAsset(null);
    setModalVisible(true);
  };

  const openEditModal = (category: KategoriUsaha) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setFormData({ name: category.name, image: category.image ?? '' });
    setImageAsset(null);
    setModalVisible(true);
  };

  const handleDelete = (category: KategoriUsaha) => {
    Alert.alert(
      'Hapus Kategori',
      `Apakah Anda yakin ingin menghapus "${category.name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await kategoriUsahaApi.delete(category.id);
              Alert.alert('Sukses', 'Kategori berhasil dihapus.');
              fetchCategories(); // Muat ulang daftar kategori
            } catch (e: any) {
              Alert.alert('Error', e.message);
            }
          },
        },
      ]
    );
  };

  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.5 });
    if (result.didCancel || result.errorCode) {return;}
    const asset = result.assets?.[0];
    if (asset) {
      setImageAsset(asset);
      setFormData(prev => ({ ...prev, image: asset.uri || '' }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      Alert.alert('Input Tidak Lengkap', 'Nama kategori wajib diisi.');
      return;
    }
    setFormLoading(true);
    let payload = { ...formData };
    try {
      if (imageAsset) {
        payload.image = await uploaderApi.uploadImage(imageAsset);
      }
      if (isEditMode && currentCategory) {
        await kategoriUsahaApi.update(currentCategory.id, payload);
      } else {
        await kategoriUsahaApi.create(payload);
      }
      Alert.alert('Sukses', `Kategori berhasil ${isEditMode ? 'diperbarui' : 'dibuat'}.`);
      setModalVisible(false);
      fetchCategories();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setFormLoading(false);
    }
  };

  const placeholderColor = isDark ? '#A1A1AA' : '#6B7281';

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-zinc-900">
      <View className="p-4 flex-row justify-between items-center border-b border-gray-200 dark:border-zinc-800">
        <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100">Manajemen Kategori</Text>
        <TouchableOpacity onPress={openAddModal} className="bg-yellow-500 p-2.5 rounded-full shadow-md">
          <Icon name="plus" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FBBF24" className="mt-10" />
      ) : error ? (
        <View className="p-4 items-center"><Text className="text-red-500">{error}</Text></View>
      ) : (
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <CategoryCard category={item} onEdit={() => openEditModal(item)} onDelete={() => handleDelete(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">Belum ada kategori.</Text>}
        />
      )}

      {/* Modal Form */}
      <Modal transparent={true} visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable onPress={() => setModalVisible(false)} style={styles.modalOverlay}>
          <Pressable className="w-11/12 bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-xl">
            <Text className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
              {isEditMode ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </Text>

            <TouchableOpacity onPress={handleImagePick} className="items-center justify-center h-28 w-28 self-center bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-zinc-600 mb-6">
              {formData.image ? (
                <Image source={{ uri: formData.image }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <Icon name="camera" size={32} color={placeholderColor} />
              )}
            </TouchableOpacity>

            <TextInput
              placeholder="Nama Kategori"
              value={formData.name}
              onChangeText={v => setFormData(prev => ({ ...prev, name: v }))}
              placeholderTextColor={placeholderColor}
              className="bg-gray-100 dark:bg-zinc-700 p-4 rounded-lg text-black dark:text-white text-base mb-6"
            />

            <TouchableOpacity onPress={handleSubmit} disabled={formLoading} className="bg-yellow-500 p-4 rounded-lg items-center justify-center shadow-md">
              {formLoading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">{isEditMode ? 'Simpan Perubahan' : 'Tambah'}</Text>}
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: { padding: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
});

export default ManajemenKategoriScreen;
