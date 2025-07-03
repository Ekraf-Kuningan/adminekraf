/* eslint-disable react-native/no-inline-styles */
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
import { Product, ProductPayload, BusinessCategory } from '../../lib/types';
import { useTheme } from '../Context/ThemeContext';

type FormRouteProp = RouteProp<{ params: { product?: Product } }, 'params'>;

/**
 * Komponen Input Kustom untuk konsistensi form.
 */
interface FormInputProps extends TextInputProps {
  label: string;
  iconName?: string;
}
const FormInput = ({ label, iconName, ...props }: FormInputProps) => {
  const { isDark } = useTheme();
  const placeholderColor = isDark ? '#A1A1AA' : '#9CA3AF';
  const labelColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const inputContainerStyle = 'bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 flex-row items-center';
  const inputTextStyle = 'flex-1 p-4 text-base text-black dark:text-white';
  const iconColor = isDark ? '#71717A' : '#9CA3AF';

  return (
    <View>
      <Text className={`text-sm font-semibold mb-2 ${labelColor}`}>{label}</Text>
      <View className={inputContainerStyle}>
        {iconName && <Icon name={iconName} size={20} color={iconColor} className="ml-4" />}
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
    name: existingProduct?.name ?? '',
    owner_name: existingProduct?.owner_name ?? '',
    description: existingProduct?.description ?? '',
    price: existingProduct?.price ?? 0,
    stock: existingProduct?.stock ?? 0,
    phone_number: existingProduct?.phone_number ?? '',
    business_category_id: existingProduct?.business_category_id ?? 0,
    image: existingProduct?.image ?? '',
  });

  const [imageAsset, setImageAsset] = useState<Asset | null>(null);
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
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
      setFormData(prev => ({ ...prev, image: asset.uri ?? prev.image }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.business_category_id) {
      Alert.alert('Input Tidak Lengkap', 'Nama produk, harga, dan kategori wajib diisi.');
      return;
    }
    setLoading(true);
    setError(null);
    let finalPayload = { ...formData };
    try {
      if (imageAsset) {
        const imageUrl = await uploaderApi.uploadImage(imageAsset);
        finalPayload.image = imageUrl;
      }
      if (isEditMode) {
        await productsApi.update(existingProduct.id, finalPayload);
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


      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View className="p-4 space-y-6">
          {/* Section: Gambar Produk */}
          <View>
            <Text className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">Gambar Produk</Text>
            <TouchableOpacity onPress={handleImagePick} className="items-center justify-center h-48 bg-gray-200 dark:bg-zinc-800 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-zinc-700">
                {formData.image ? (
                    <Image source={{ uri: formData.image }} className="w-full h-full" resizeMode="cover" />
                ) : (
                    <View className="items-center">
                        <Icon name="camera" size={40} color={placeholderColor} />
                        <Text className="mt-2 text-gray-500 dark:text-gray-400">Pilih Gambar</Text>
                    </View>
                )}
            </TouchableOpacity>
          </View>

          {/* Section: Informasi Dasar */}
          <View className="space-y-4">
             <Text className="text-lg font-bold text-gray-800 dark:text-gray-200">Informasi Dasar</Text>
            <FormInput label="Nama Produk" iconName="box" placeholder="Contoh: Kopi Gula Aren" value={formData.name} onChangeText={v => handleInputChange('name', v)} />
            <FormInput label="Nama Pelaku Usaha" iconName="user" placeholder="Nama Anda atau Brand" value={formData.owner_name} onChangeText={v => handleInputChange('owner_name', v)} />
            <FormInput label="Deskripsi (Opsional)" iconName="file-text" placeholder="Jelaskan keunikan produk Anda..." value={formData.description} multiline numberOfLines={4} style={{ height: 120, textAlignVertical: 'top' }} />
          </View>

          {/* Section: Harga dan Stok */}
          <View className="space-y-4">
            <Text className="text-lg font-bold text-gray-800 dark:text-gray-200">Harga & Stok</Text>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <FormInput
                  label="Harga"
                  iconName="credit-card" // Menggunakan ikon 'credit-card' untuk rupiah
                  placeholder="50.000"
                  value={
                    formData.price === 0
                      ? ''
                      : formData.price.toLocaleString('id-ID')
                  }
                  onChangeText={v => {
                    // Remove non-digit, parse to number
                    const numeric = Number(v.replace(/\D/g, ''));
                    handleInputChange('price', numeric);
                  }}
                  keyboardType="numeric"
                />
                {formData.price > 0 && (
                  <Text className="text-xs text-gray-500 mt-1">
                    Rp {formData.price.toLocaleString('id-ID')}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                  <FormInput label="Stok" iconName="package" placeholder="100" value={String(formData.stock === 0 ? '' : formData.stock)} onChangeText={v => handleInputChange('stock', Number(v.replace(/\D/g, '')))} keyboardType="numeric" />
              </View>
            </View>
          </View>

          {/* Section: Kategori dan Kontak */}
          <View className="space-y-4">
             <Text className="text-lg font-bold text-gray-800 dark:text-gray-200">Kategori & Kontak</Text>
            <View>
              <Text className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300">Kategori Usaha</Text>
              <CustomPicker placeholder="Pilih Kategori Usaha..." items={categories.map(cat => ({ label: cat.name, value: cat.id }))} selectedValue={formData.business_category_id} onValueChange={(value) => handleInputChange('business_category_id', value)} disabled={!categories.length} />
            </View>
            <FormInput label="No. HP (Opsional)" iconName="phone" placeholder="08xxxxxxxxxx" value={formData.phone_number ?? ''} onChangeText={v => handleInputChange('phone_number', v)} keyboardType="phone-pad" />
          </View>

          {/* Submit Button */}
          <TouchableOpacity onPress={handleSubmit} disabled={loading} className="bg-yellow-500 p-4 rounded-full items-center justify-center mt-6 shadow-lg shadow-yellow-500/50 active:bg-yellow-600">
              {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg tracking-wider">{isEditMode ? 'SIMPAN PERUBAHAN' : 'TAMBAH PRODUK'}</Text>}
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
