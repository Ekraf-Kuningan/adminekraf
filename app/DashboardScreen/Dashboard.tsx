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
 * Komponen Kartu Statistik yang Didesain Ulang untuk Tampilan Berjajar
 */
const StatCard = ({ icon, label, value, color, loading }: { icon: string; label: string; value: string; color: string; loading: boolean; }) => (
    <View className={`p-4 rounded-2xl flex-1 ${color} shadow-lg items-center justify-center`} style={{ shadowColor: color }}>
        <Icon name={icon} size={28} color="white" className="mb-2" />
        {loading ? (
            <ActivityIndicator color="white" />
        ) : (
            <Text className="text-3xl font-extrabold text-white">{value}</Text>
        )}
        <Text className="text-white/90 text-sm font-medium text-center mt-1">{label}</Text>
    </View>
);

/**
 * Komponen Kartu untuk Produk Terbaru
 */
const RecentProductCard = ({ product, onPress }: { product: Product, onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} className="w-44 mr-4 bg-white dark:bg-zinc-800 rounded-xl shadow-md shadow-gray-200/50 dark:shadow-none overflow-hidden border border-gray-100 dark:border-zinc-700">
        <Image source={{ uri: product.image ?? 'https://placehold.co/200x200/e2e8f0/e2e8f0' }} className="w-full h-24" />
        <View className="p-3">
            <Text className="text-sm font-semibold text-gray-800 dark:text-gray-100" numberOfLines={1}>{product.name}</Text>
            <Text className="text-xs text-yellow-600 dark:text-yellow-500 font-bold mt-1">Rp {(product.price ?? 0).toLocaleString('id-ID')}</Text>
        </View>
    </TouchableOpacity>
);

/**
 * Komponen Item untuk Aktivitas Terkini
 */
const ActivityItem = ({ icon, text, time, iconColor }: { icon: string; text: React.ReactNode; time: string; iconColor: string; }) => {
    useTheme();
    return (
        <View className="flex-row items-center gap-4">
            <View className={'w-12 h-12 rounded-full items-center justify-center'} style={{backgroundColor: iconColor + '1A'}}>
                <Icon name={icon} size={24} color={iconColor} />
            </View>
            <View className="flex-1">
                <Text className="text-base text-gray-700 dark:text-gray-200 leading-snug">{text}</Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">{time}</Text>
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
  const { isDark } = useTheme(); // Panggil useTheme di sini

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {setUser(JSON.parse(userDataString));}

      const [userResponse, productResponse, categoryResponse] = await Promise.all([
        usersApi.getAll(),
        productsApi.getAll({ limit: 10 }), // Ambil 10 produk
        masterDataApi.getBusinessCategories(),
      ]);

      // Filter users dengan level "user" (UMKM)
      const umkmUsers = userResponse.filter(u => {
        const levelName = u.levels?.name || u.level;
        return levelName === 'user';
      });

      console.log('📊 Total users ditemukan:', userResponse.length);
      console.log('🏢 UMKM users (level: user) ditemukan:', umkmUsers.length);
      console.log('👥 Daftar level users:', userResponse.map(u => ({ 
        name: u.name, 
        level: u.levels?.name || u.level 
      })));

      setStats({
        users: String(umkmUsers.length),
        products: String(productResponse.data.length),
        categories: String(categoryResponse.length),
      });

      setRecentProducts(productResponse.data.slice(0, 5));
      setRecentUsers(umkmUsers.slice(0, 3));

    } catch (e: any) {
      setError(e.message ?? 'Terjadi kesalahan saat memuat data');
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
        <View className="flex-row justify-between items-center p-5">
            <View>
                <Text className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                    Dashboard
                </Text>
                <Text className="text-md text-gray-500 dark:text-gray-400">
                    Selamat Datang, {user?.name ?? 'Admin'}!
                </Text>
            </View>
            <TouchableOpacity className="bg-white dark:bg-zinc-800 p-3 rounded-full border border-gray-200 dark:border-zinc-700">
                <Icon name="bell" size={20} color={isDark ? 'white' : 'black'}/>
            </TouchableOpacity>
        </View>

        {/* Kartu Statistik */}
        <View className="px-5 py-2">
            {/* Ganti gap-3 dengan gap-3 untuk memberikan jarak */}
            <View className="flex-row gap-3">
                <StatCard icon="users" label="Mitra UMKM" value={stats.users} color="bg-blue-500" loading={loading} />
                <StatCard icon="package" label="Total Produk" value={stats.products} color="bg-green-500" loading={loading} />
                <StatCard icon="grid" label="Kategori" value={stats.categories} color="bg-purple-500" loading={loading} />
            </View>
        </View>

        {error && <Text className="text-red-500 text-center p-4">{error}</Text>}

        {/* Produk Terbaru */}
        <View className="mt-8">
          <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 mx-5 mb-4">
            Produk Terbaru
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
            {loading ? (
                <View className="w-full flex-row justify-center"><ActivityIndicator size="small" color="#F59E0B" /></View>
            ) : (
                recentProducts.map(product => (
                    <RecentProductCard key={product.id} product={product} onPress={() => navigation.navigate('FormProdukScreen', { product })} />
                ))
            )}
          </ScrollView>
        </View>

        {/* Aktivitas Terkini */}
        <View className="p-5 mt-4">
          <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-5">
            Aktivitas Terkini
          </Text>
          <View className="space-y-6">
            {loading ? (
                 <ActivityIndicator size="small" color="#F59E0B" />
            ) : (
                recentUsers.map(u => (
                    <ActivityItem
                        key={`user-${u.id}`}
                        icon="user-plus"
                        text={<Text>Mitra baru <Text className="font-bold">{u.name}</Text> telah mendaftar.</Text>}
                        time={new Date(u.verifiedAt ?? Date.now()).toLocaleDateString('id-ID', {day: 'numeric', month: 'long'})}
                        iconColor="#3B82F6"
                    />
                ))
            )}
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
    paddingLeft: 20,
    paddingRight: 5,
  },
});

export default DashboardAdminScreen;
