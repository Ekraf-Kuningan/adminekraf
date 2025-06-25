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
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { CustomPicker } from '../../components/CustomPicker';
import { productsApi, uploaderApi, masterDataApi } from '../../lib/api';
import { Product, ProductPayload, KategoriUsaha } from '../../lib/types';
import { useTheme } from '../Context/ThemeContext';

type FormRouteProp = RouteProp<{ params: { product?: Product } }, 'params'>;

/**
 * Komponen Input Kustom untuk konsistensi form.
 */
interface FormInputProps extends TextInputProps {
  label: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FormInput = ({ label, ...props }: FormInputProps) => {
  const { isDark } = useTheme();
  const placeholderColor = isDark ? '#A1A1AA' : '#6B7281';
  const inputContainerStyle = 'bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700';
  const inputTextStyle = 'p-3 text-base text-black dark:text-white';

  return (
    <View>
      <View className={inputContainerStyle}>
        <TextInput
          placeholderTextColor={placeholderColor}
          className={inputTextStyle}
          {...props}
        />
      </View>
    </View>
  );
};


const FormProdukScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<FormRouteProp>();
  const { isDark } = useTheme();

  const existingProduct = route.params?.product;
  const isEditMode = !!existingProduct;

  const [formData, setFormData] = useState<ProductPayload>({
    nama_produk: existingProduct?.nama_produk || '',
    nama_pelaku: existingProduct?.nama_pelaku || '',
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
    if (result.didCancel || result.errorCode) { return; }
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

  const placeholderColor = isDark ? '#A1A1AA' : '#6B7281';

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Icon name="arrow-left" size={24} color={isDark ? 'white' : 'black'} />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-bold text-slate-800 dark:text-slate-100 text-center mr-8">
            {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View className="p-4 space-y-5">
            {/* Image Picker */}
            <View>
              <Text className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300">Gambar Produk</Text>
              <TouchableOpacity onPress={handleImagePick} className="items-center justify-center h-48 bg-gray-200 dark:bg-zinc-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-zinc-700">
                  {formData.gambar ? (
                      <Image source={{ uri: formData.gambar }} className="w-full h-full" resizeMode="cover" />
                  ) : (
                      <View className="items-center">
                          <Icon name="camera" size={40} color={placeholderColor} />
                          <Text className="mt-2 text-gray-500 dark:text-gray-400">Pilih Gambar</Text>
                      </View>
                  )}
              </TouchableOpacity>
            </View>

            {/* Form Inputs */}
            <FormInput label="Nama Produk" placeholder="Contoh: Kopi Gula Aren" value={formData.nama_produk} onChangeText={v => handleInputChange('nama_produk', v)} />
            <FormInput label="Nama Pelaku Usaha" placeholder="Nama Anda atau Brand" value={formData.nama_pelaku} onChangeText={v => handleInputChange('nama_pelaku', v)} />
            <FormInput label="Deskripsi (Opsional)" placeholder="Jelaskan keunikan produk Anda..." value={formData.deskripsi} multiline numberOfLines={4} style={{ height: 120, textAlignVertical: 'top' }} />
            <FormInput label="Harga" placeholder="Contoh: 50000" value={String(formData.harga === 0 ? '' : formData.harga)} onChangeText={v => handleInputChange('harga', Number(v.replace(/[^0-9]/g, '')))} keyboardType="numeric" />
            <FormInput label="Stok" placeholder="Jumlah stok tersedia" value={String(formData.stok === 0 ? '' : formData.stok)} onChangeText={v => handleInputChange('stok', Number(v.replace(/[^0-9]/g, '')))} keyboardType="numeric" />
            <FormInput label="No. HP (Opsional)" placeholder="08xxxxxxxxxx" value={formData.nohp || ''} onChangeText={v => handleInputChange('nohp', v)} keyboardType="phone-pad" />

            {/* Custom Picker */}
            <View>
              <Text className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300">Kategori Usaha</Text>
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
            </View>

            {/* Submit Button */}
            <TouchableOpacity onPress={handleSubmit} disabled={loading} className="bg-yellow-500 p-4 rounded-lg items-center justify-center mt-6 shadow-md shadow-yellow-400/50 active:bg-yellow-600">
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
