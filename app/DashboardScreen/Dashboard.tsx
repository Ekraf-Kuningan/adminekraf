// screens/admin/DashboardAdminScreen.tsx

import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Image,
} from 'react-native';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useTheme } from '../Context/ThemeContext';
import { User, Product } from '../../lib/types';
import { usersApi, productsApi, masterDataApi } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipe untuk Navigasi
type AdminNavProp = NavigationProp<{
  ManajemenMitraScreen: undefined;
  ManajemenProdukScreen: undefined;
  ManajemenKategoriScreen: undefined;
  FormProdukScreen: { product: Product };
}>;

/**
 * Komponen Kartu Statistik yang Diperbarui
 */
const StatCard = ({ icon, label, value, color, loading }: { icon: string; label: string; value: string; color: string; loading: boolean; }) => (
  <View className={`p-4 rounded-2xl flex-1 ${color} shadow-lg`} style={{ shadowColor: color }}>
    <View className="flex-row justify-between items-start">
      <View className="bg-white/30 p-2 rounded-lg">
        <Icon name={icon} size={24} color="white" />
      </View>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-4xl font-extrabold text-white">{value}</Text>
      )}
    </View>
    <Text className="text-white font-semibold mt-4 text-base">{label}</Text>
  </View>
);

/**
 * Komponen Kartu untuk Produk Terbaru
 */
const RecentProductCard = ({ product, onPress }: { product: Product, onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} className="w-40 mr-4 bg-white dark:bg-zinc-800 rounded-lg shadow-sm overflow-hidden">
        <Image source={{ uri: product.gambar || 'https://placehold.co/200x200/e2e8f0/e2e8f0' }} className="w-full h-24" />
        <View className="p-2">
            <Text className="text-sm font-semibold text-gray-800 dark:text-gray-100" numberOfLines={1}>{product.nama_produk}</Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">Rp {product.harga.toLocaleString('id-ID')}</Text>
        </View>
    </TouchableOpacity>
);

/**
 * Komponen Item untuk Aktivitas Terkini
 */
const ActivityItem = ({ icon, text, time, iconColor }: { icon: string; text: React.ReactNode; time: string; iconColor: string; }) => {
    useTheme();
    return (
        <View className="flex-row items-center space-x-4">
            <View className={'w-12 h-12 rounded-full items-center justify-center'} style={{backgroundColor: iconColor + '1A'}}>
                <Icon name={icon} size={24} color={iconColor} />
            </View>
            <View className="flex-1">
                <Text className="text-base text-gray-800 dark:text-gray-200">{text}</Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">{time}</Text>
            </View>
        </View>
    );
};

/**
 * Layar Utama Dashboard Admin
 */
const DashboardAdminScreen = () => {
  const navigation = useNavigation<AdminNavProp>();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ users: '0', products: '0', categories: '0' });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {setUser(JSON.parse(userDataString));}

      const [userResponse, productResponse, categoryResponse] = await Promise.all([
        usersApi.getAll(),
        productsApi.getAll({ limit: 5 }), // Ambil 5 produk terbaru
        masterDataApi.getBusinessCategories(),
      ]);

      const umkmUsers = userResponse.filter(u => u.tbl_level?.level === 'UMKM');

      setStats({
        users: String(umkmUsers.length),
        products: String(productResponse.data.length), // Ini akan menjadi total dari halaman pertama
        categories: String(categoryResponse.length),
      });

      // Ambil 5 produk dan user terbaru untuk ditampilkan
      setRecentProducts(productResponse.data.slice(0, 5));
      setRecentUsers(umkmUsers.slice(0, 3)); // Ambil 3 user terbaru

    } catch (e: any) {
      setError(e.message || 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-zinc-900">
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} tintColor="#F59E0B" />}
      >
        {/* Header */}
        <View className="p-5">
          <Text className="text-sm text-gray-500 dark:text-gray-400">Dashboard</Text>
          <Text className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
            Selamat Datang, {user?.nama_user || 'Admin'}!
          </Text>
        </View>

        {/* Kartu Statistik */}
        <View className="px-5 space-y-3">
            <StatCard icon="users" label="Total Mitra UMKM" value={stats.users} color="bg-blue-500" loading={loading} />
            <View className="flex-row space-x-3">
                <StatCard icon="package" label="Produk Baru" value={stats.products} color="bg-green-500" loading={loading} />
                <StatCard icon="grid" label="Total Kategori" value={stats.categories} color="bg-purple-500" loading={loading} />
            </View>
        </View>

        {error && <Text className="text-red-500 text-center p-4">{error}</Text>}

        {/* Produk Terbaru */}
        <View className="mt-6">
          <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 mx-5 mb-3">
            Produk Terbaru
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
            {loading ? (
                <ActivityIndicator size="small" color="#F59E0B" />
            ) : (
                recentProducts.map(product => (
                    <RecentProductCard key={product.id_produk} product={product} onPress={() => navigation.navigate('FormProdukScreen', { product })} />
                ))
            )}
          </ScrollView>
        </View>

        {/* Aktivitas Terkini */}
        <View className="p-5 mt-4">
          <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Aktivitas Terkini
          </Text>
          <View className="space-y-6">
            {loading ? (
                 <ActivityIndicator size="small" color="#F59E0B" />
            ) : (
                recentUsers.map(u => (
                    <ActivityItem
                        key={`user-${u.id_user}`}
                        icon="user-plus"
                        text={<Text>Mitra baru <Text className="font-bold">{u.nama_user}</Text> telah mendaftar.</Text>}
                        time={new Date(u.verifiedAt || Date.now()).toLocaleDateString('id-ID', {day: 'numeric', month: 'long'})}
                        iconColor="#3B82F6"
                    />
                ))
            )}
            {/* Contoh aktivitas statis */}
            <ActivityItem
                icon="settings"
                text={<Text>Sistem telah diperbarui.</Text>}
                time="Kemarin"
                iconColor="#8B5CF6"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  horizontalScrollContent: {
    paddingHorizontal: 20,
  },
});

export default DashboardAdminScreen;
