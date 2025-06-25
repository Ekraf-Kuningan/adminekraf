// screens/admin/ManajemenProdukScreen.tsx

import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useTheme } from '../Context/ThemeContext';
import { productsApi } from '../../lib/api';
import { Product } from '../../lib/types';
import { StyleSheet } from 'react-native';

// Tipe untuk Navigasi
type ProductNavProp = NavigationProp<{
  FormProdukScreen: { product?: Product }; // Mengirim data produk saat edit
}>;

/**
 * Komponen Kartu untuk setiap item produk dalam daftar
 */
const ProductCard = ({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const getStatusStyle = (status: Product['status_produk']) => {
    switch (status) {
      case 'disetujui':
        return {
          container: 'bg-green-100 dark:bg-green-900/50',
          text: 'text-green-600 dark:text-green-400',
          label: 'Disetujui',
        };
      case 'ditolak':
        return {
          container: 'bg-red-100 dark:bg-red-900/50',
          text: 'text-red-600 dark:text-red-400',
          label: 'Ditolak',
        };
      case 'pending':
        return {
          container: 'bg-yellow-100 dark:bg-yellow-900/50',
          text: 'text-yellow-600 dark:text-yellow-400',
          label: 'Pending',
        };
      default:
        return {
          container: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-600 dark:text-gray-400',
          label: 'Tidak Aktif',
        };
    }
  };

  const statusStyle = getStatusStyle(product.status_produk);

  return (
    <View className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm mb-4 overflow-hidden">
      <Image
        source={{ uri: product.gambar || 'https://placehold.co/600x400/e2e8f0/e2e8f0' }}
        className="w-full h-40"
        resizeMode="cover"
      />
      <View className="p-4">
        <View className="flex-row justify-between items-start">
            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 flex-1 pr-2" numberOfLines={2}>
              {product.nama_produk}
            </Text>
            <View className={`px-3 py-1 rounded-full ${statusStyle.container}`}>
                <Text className={`font-semibold text-xs ${statusStyle.text}`}>
                {statusStyle.label}
                </Text>
            </View>
        </View>

        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Oleh: {product.tbl_user?.nama_user || product.nama_pelaku}
        </Text>
        <Text className="text-base font-bold text-yellow-500 mt-2">
          Rp {product.harga.toLocaleString('id-ID')}
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-300">
          Stok: {product.stok}
        </Text>
      </View>
      <View className="flex-row border-t border-gray-100 dark:border-zinc-700">
        <TouchableOpacity onPress={onEdit} className="flex-1 p-3 items-center justify-center flex-row border-r border-gray-100 dark:border-zinc-700">
            <Icon name="edit" size={16} color="#6B7280" />
            <Text className="ml-2 text-gray-600 dark:text-gray-300 font-semibold">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} className="flex-1 p-3 items-center justify-center flex-row">
            <Icon name="trash-2" size={16} color="#EF4444" />
            <Text className="ml-2 text-red-500 font-semibold">Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


/**
 * Layar Utama Manajemen Produk
 */
const ManajemenProdukScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<ProductNavProp>();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk paginasi
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async (isRefreshing = false) => {
    setLoading(true);
    setError(null);
    const currentPage = isRefreshing ? 1 : page;

    try {
      const response = await productsApi.getAll({
          page: currentPage,
          limit: 10,
          q: searchQuery,
        });

      if (isRefreshing) {
        setProducts(response.data);
      } else {
        setProducts(prev => [...prev, ...response.data]);
      }
      setTotalPages(response.totalPages);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  // Fetch data saat layar fokus atau saat query berubah
  useFocusEffect(
    useCallback(() => {
        setProducts([]); // Kosongkan produk sebelum fetch baru
        setPage(1);
        fetchProducts(true);
    }, [fetchProducts])
  );

  const handleDelete = (productId: number) => {
    Alert.alert(
      'Hapus Produk',
      'Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await productsApi.delete(productId);
              Alert.alert('Sukses', 'Produk berhasil dihapus.');
              // Refresh list
              setProducts(prev => prev.filter(p => p.id_produk !== productId));
            } catch (e: any) {
              Alert.alert('Error', e.message);
            }
          },
        },
      ]
    );
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
        setPage(prev => prev + 1);
    }
  };

  const placeholderColor = isDark ? '#9CA3AF' : '#6B7281';

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-zinc-900">

      {/* Search dan Add Button */}
      <View className="flex-row p-4 items-center space-x-2">
        <View className="flex-1 bg-white dark:bg-zinc-800 p-2 rounded-lg border border-gray-300 dark:border-zinc-700 flex-row items-center">
            <Icon name="search" size={20} color={placeholderColor} />
           <TextInput placeholder="Cari Mitra..." placeholderTextColor={placeholderColor} value={searchQuery} onChangeText={setSearchQuery} className="text-base flex-1 text-black dark:text-white h-10 px-2" />
        </View>
        <TouchableOpacity
            onPress={() => navigation.navigate('FormProdukScreen', {})}
            className="bg-yellow-500 p-3 rounded-lg"
        >
            <Icon name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {error && (
        <View className="p-4 items-center">
            <Text className="text-red-500">{error}</Text>
            <TouchableOpacity onPress={() => fetchProducts(true)} className="mt-2 bg-yellow-500 px-4 py-2 rounded-lg">
                <Text className="text-white font-semibold">Coba Lagi</Text>
            </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onEdit={() => navigation.navigate('FormProdukScreen', { product: item })}
            onDelete={() => handleDelete(item.id_produk)}
          />
        )}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={() => fetchProducts(true)}
        refreshing={loading && page === 1}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && page > 1 ? <ActivityIndicator size="large" color="#FBBF24" className="my-4" /> : null}
        ListEmptyComponent={!loading ? (
            <View className="items-center justify-center mt-20">
                <Text className="text-gray-500 dark:text-gray-400">Tidak ada produk ditemukan.</Text>
            </View>
        ) : null}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default ManajemenProdukScreen;
