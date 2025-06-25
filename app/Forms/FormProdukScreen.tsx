// screens/admin/FormProdukScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
// Hapus import RNPickerSelect
// import RNPickerSelect from 'react-native-picker-select';

// Impor komponen kustom yang baru
import { CustomPicker } from '../../components/CustomPicker';
import { productsApi, uploaderApi, masterDataApi } from '../../lib/api';
import { Product, ProductPayload, KategoriUsaha } from '../../lib/types';
import { useTheme } from '../Context/ThemeContext';
import { StyleSheet } from 'react-native';

type FormRouteProp = RouteProp<{ params: { product?: Product } }, 'params'>;

const FormProdukScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<FormRouteProp>();
  const { isDark } = useTheme();

  const existingProduct = route.params?.product;
  const isEditMode = !!existingProduct;

  const [formData, setFormData] = useState<ProductPayload>({
    nama_produk: existingProduct?.nama_produk || '',
    nama_pelaku: existingProduct?.nama_pelaku || '', // Sebaiknya diisi otomatis dari data user login jika ada
    deskripsi: existingProduct?.deskripsi || '',
    harga: existingProduct?.harga || 0,
    stok: existingProduct?.stok || 0,
    nohp: existingProduct?.nohp || '',
    id_kategori_usaha: existingProduct?.id_kategori_usaha || 0,
    gambar: existingProduct?.gambar || '',
  });

  const [imageAsset, setImageAsset] = useState<Asset | null>(null);
  const [categories, setCategories] = useState<KategoriUsaha[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    masterDataApi.getBusinessCategories()
      .then(setCategories)
      .catch(_ => setError('Gagal memuat kategori.'));
  }, []);

  const handleInputChange = (field: keyof ProductPayload, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    if (result.didCancel || result.errorCode) {
      return;
    }
    const asset = result.assets?.[0];
    if (asset) {
      setImageAsset(asset);
      setFormData(prev => ({ ...prev, gambar: asset.uri || prev.gambar }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.nama_produk || !formData.harga || !formData.id_kategori_usaha) {
        Alert.alert('Input Tidak Lengkap', 'Nama produk, harga, dan kategori wajib diisi.');
        return;
    }

    setLoading(true);
    setError(null);
    let finalPayload = { ...formData };

    try {
        if (imageAsset) {
            const imageUrl = await uploaderApi.uploadImage(imageAsset);
            finalPayload.gambar = imageUrl;
        }

        if (isEditMode) {
            await productsApi.update(existingProduct.id_produk, finalPayload);
        } else {
            await productsApi.create(finalPayload);
        }

        Alert.alert('Sukses', `Produk berhasil ${isEditMode ? 'diperbarui' : 'dibuat'}.`);
        navigation.goBack();

    } catch (e: any) {
        setError(e.message);
        Alert.alert('Error', e.message);
    } finally {
        setLoading(false);
    }
  };

  // Hapus pickerStyle karena sudah tidak digunakan
  // const pickerStyle = { ... };

  const placeholderColor = isDark ? '#A1A1AA' : '#6B7281';
  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-zinc-900">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View className="p-4">
            <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-4 left-4 z-10 p-2">
                <Icon name="arrow-left" size={24} color={isDark ? 'white' : 'black'} />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">
                {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
            </Text>
        </View>

        <View className="p-4 space-y-4">
            <TouchableOpacity onPress={handleImagePick} className="items-center justify-center h-48 bg-gray-200 dark:bg-zinc-800 rounded-lg overflow-hidden">
                {formData.gambar ? (
                    <Image source={{ uri: formData.gambar }} className="w-full h-full" resizeMode="cover" />
                ) : (
                    <View className="items-center">
                        <Icon name="camera" size={40} color={placeholderColor} />
                        <Text className="mt-2 text-gray-500 dark:text-gray-400">Pilih Gambar Produk</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TextInput placeholder="Nama Produk" value={formData.nama_produk} onChangeText={v => handleInputChange('nama_produk', v)} placeholderTextColor={placeholderColor} className="bg-white dark:bg-zinc-800 p-3 rounded-lg text-black dark:text-white" />
            <TextInput placeholder="Nama Pelaku Usaha" value={formData.nama_pelaku} onChangeText={v => handleInputChange('nama_pelaku', v)} placeholderTextColor={placeholderColor} className="bg-white dark:bg-zinc-800 p-3 rounded-lg text-black dark:text-white" />
            <TextInput placeholder="Deskripsi (Opsional)" value={formData.deskripsi} onChangeText={v => handleInputChange('deskripsi', v)} placeholderTextColor={placeholderColor} multiline numberOfLines={4} className="bg-white dark:bg-zinc-800 p-3 rounded-lg text-black dark:text-white h-24" />
            <TextInput placeholder="Harga (Contoh: 50000)" value={String(formData.harga)} onChangeText={v => handleInputChange('harga', Number(v.replace(/[^0-9]/g, '')))} placeholderTextColor={placeholderColor} keyboardType="numeric" className="bg-white dark:bg-zinc-800 p-3 rounded-lg text-black dark:text-white" />
            <TextInput placeholder="Stok" value={String(formData.stok)} onChangeText={v => handleInputChange('stok', Number(v.replace(/[^0-9]/g, '')))} placeholderTextColor={placeholderColor} keyboardType="numeric" className="bg-white dark:bg-zinc-800 p-3 rounded-lg text-black dark:text-white" />
            <TextInput placeholder="No. HP (Opsional)" value={formData.nohp || ''} onChangeText={v => handleInputChange('nohp', v)} placeholderTextColor={placeholderColor} keyboardType="phone-pad" className="bg-white dark:bg-zinc-800 p-3 rounded-lg text-black dark:text-white" />

            {/* Ganti RNPickerSelect dengan CustomPicker */}
            <CustomPicker
                placeholder="Pilih Kategori Usaha..."
                items={categories.map(cat => ({
                    label: cat.nama_kategori,
                    value: cat.id_kategori_usaha,
                }))}
                selectedValue={formData.id_kategori_usaha}
                onValueChange={(value) => handleInputChange('id_kategori_usaha', value)}
                disabled={!categories.length}
            />

            <TouchableOpacity onPress={handleSubmit} disabled={loading} className="bg-yellow-500 p-4 rounded-lg items-center justify-center mt-4">
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">
                        {isEditMode ? 'Simpan Perubahan' : 'Simpan Produk'}
                    </Text>
                )}
            </TouchableOpacity>

            {error && <Text className="text-red-500 text-center mt-2">{error}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
});

export default FormProdukScreen;
