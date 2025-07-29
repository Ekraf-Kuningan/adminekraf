import React, { useState, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../Context/ThemeContext';
import { User } from '../../lib/types';
import { usersApi } from '../../lib/api';

// --- Tipe Props ---
interface StatCardProps { count: number; label: string; }
interface FilterButtonProps { label: string; isActive: boolean; onPress: () => void; isDark: boolean; }
interface MitraCardProps { mitra: User; onPress: () => void; isDark: boolean; }
type MitraNavProp = NavigationProp<{ EditMitraScreen: { mitra: User }; }>;

// --- Komponen Pembantu ---
const StatCard = ({ count, label }: StatCardProps) => (
  <View className="flex-1 items-center p-3 rounded-xl shadow-md bg-yellow-500">
    <Text className="text-2xl font-bold text-white">{count}</Text>
    <Text className="text-sm text-white text-center">{label}</Text>
  </View>
);

const FilterButton = ({ label, isActive, onPress, isDark }: FilterButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-5 py-2 rounded-full border ${isActive ? 'bg-yellow-500 border-yellow-500' : `border-gray-300 dark:border-zinc-600 ${isDark ? 'bg-zinc-700' : 'bg-white'}`}`}
  >
    <Text className={`font-semibold ${isActive ? 'text-white' : `${isDark ? 'text-gray-200' : 'text-gray-600'}`}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

const formatDate = (dateString: string | null) => {
  if (!dateString) { return 'Belum Verifikasi'; }
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const MitraCard = ({ mitra, onPress }: MitraCardProps) => {
  const isActive = !!mitra.verifiedAt;
  const initial = mitra.name ? mitra.name.charAt(0).toUpperCase() : '?';

  return (
    <TouchableOpacity onPress={onPress} className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm mb-4">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-700 items-center justify-center mr-4">
          <Text className="text-gray-600 dark:text-gray-300 text-xl font-bold">{initial}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 dark:text-gray-100" numberOfLines={1}>{mitra.name}</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">{mitra.email}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${isActive ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
          <Text className={`font-semibold ${isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isActive ? 'Aktif' : 'Non-Aktif'}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700">
        <View>
          <Text className="font-semibold text-base text-gray-800 dark:text-gray-200">
            {mitra.productCount ?? 0} Produk
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-gray-500 dark:text-gray-400">{formatDate(mitra.verifiedAt ?? null)}</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">{mitra.phone_number}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};


// --- Komponen Utama ---
const ManajemenMitraScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<MitraNavProp>();
  const [allMitra, setAllMitra] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMitra = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Mengambil data pengguna...');
      const baseUsers = await usersApi.getAll();
      console.log('📊 Total pengguna ditemukan:', baseUsers.length);
      console.log('👥 Data pengguna:', baseUsers);

      // Filter user berdasarkan level name 'user' (UMKM)
      const umkmUsers = baseUsers.filter(user => {
        const levelName = user.levels?.name || user.level;
        const levelId = user.level_id;
        
        // Cek berdasarkan nama level 'user' untuk UMKM
        const isUMKM = levelName === 'user';
        
        console.log(`User ${user.name}: level_id=${levelId}, level=${levelName}, isUMKM=${isUMKM}`);
        return isUMKM;
      });

      console.log('🏢 Users dengan level UMKM ditemukan:', umkmUsers.length);
      
      if (umkmUsers.length === 0) {
        console.warn('⚠️ Tidak ada user dengan level UMKM ditemukan');
        // Untuk debugging, tampilkan level semua user
        console.log('🔍 Level semua user:', baseUsers.map(u => ({ 
          name: u.name, 
          level_id: u.level_id,
          level: u.levels?.name || u.level
        })));
        
        setAllMitra([]);
        return;
      }

      const promises = umkmUsers.map(async (user) => {
        try {
          const products = await usersApi.getProducts(user.id);
          console.log(`📦 Produk untuk ${user.name}:`, products.length);
          return { ...user, productCount: products.length };
        } catch (err) {
          console.error(`❌ Gagal mengambil produk untuk user ${user.id}:`, err);
          return { ...user, productCount: 0 };
        }
      });
      
      const usersWithProductCount = await Promise.all(promises);
      console.log('✅ Data mitra UMKM final:', usersWithProductCount);
      setAllMitra(usersWithProductCount);
    } catch (e: any) {
      console.error('❌ Error saat mengambil data mitra:', e);
      setError(e.message || 'Terjadi kesalahan saat mengambil data mitra');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchMitra(); }, [fetchMitra]));

  const filteredMitra = useMemo(() => {
    return allMitra
      .filter(mitra => {
        if (filter === 'Aktif') {return !!mitra.verifiedAt;}
        if (filter === 'NonAktif') {return !mitra.verifiedAt;}
        return true;
      })
      .filter(mitra =>
        (mitra.name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [allMitra, filter, searchQuery]);

  const stats = useMemo(() => {
    const total = allMitra.length;
    const aktif = allMitra.filter(m => !!m.verifiedAt).length;
    const nonAktif = total - aktif;
    return { total, aktif, nonAktif };
  }, [allMitra]);

  const placeholderColor = isDark ? '#9CA3AF' : '#6B7281';

  if (loading && !allMitra.length) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100 dark:bg-zinc-900">
        <ActivityIndicator size="large" color="#FBBF24" />
        <Text className="text-gray-600 dark:text-gray-400 mt-4 text-lg">Memuat data mitra UMKM...</Text>
        <Text className="text-gray-500 dark:text-gray-500 mt-2 text-sm">Mohon tunggu sebentar</Text>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100 dark:bg-zinc-900 p-4">
        <Text className="text-red-500 text-center text-lg font-medium">❌ Gagal Memuat Data</Text>
        <Text className="text-red-400 text-center mt-2">{error}</Text>
        <TouchableOpacity onPress={fetchMitra} className="mt-6 bg-yellow-500 px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold text-lg">🔄 Coba Lagi</Text>
        </TouchableOpacity>
        <Text className="text-gray-500 dark:text-gray-400 text-sm mt-4 text-center">
          Pastikan Anda sudah login dan memiliki akses admin
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-zinc-900">
      <View className="p-4"/>
      <FlatList
        ListHeaderComponent={
          <>
            <View className="bg-yellow-400 rounded-2xl mx-4 p-4 shadow-lg">
              <Text className="text-xl font-bold text-white">Admin Panel</Text>
              <Text className="text-sm text-white mb-4">Dashboard / Daftar Mitra UMKM</Text>
              <View className="flex-row justify-between gap-3">
                <StatCard count={stats.total} label="Total Mitra UMKM" /><StatCard count={stats.aktif} label="Aktif" /><StatCard count={stats.nonAktif} label="Non-aktif" />
              </View>
            </View>
            <View className="p-4">
              <View className="bg-white dark:bg-zinc-800 p-2 rounded-lg border border-gray-200 dark:border-zinc-700 flex-row items-center">
                <TextInput placeholder="Cari Mitra UMKM..." placeholderTextColor={placeholderColor} value={searchQuery} onChangeText={setSearchQuery} className="text-base flex-1 text-black dark:text-white h-10 px-2" />
              </View>
              <View className="flex-row gap-2 mt-4">
                <FilterButton label="Semua" isActive={filter === 'Semua'} onPress={() => setFilter('Semua')} isDark={isDark} /><FilterButton label="Aktif" isActive={filter === 'Aktif'} onPress={() => setFilter('Aktif')} isDark={isDark} /><FilterButton label="Non-Aktif" isActive={filter === 'NonAktif'} onPress={() => setFilter('NonAktif')} isDark={isDark} />
              </View>
              <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-2">Daftar Mitra UMKM</Text>
            </View>
          </>
        }
        data={filteredMitra}
        renderItem={({ item }) => (
          <MitraCard mitra={item} isDark={isDark} onPress={() => navigation.navigate('EditMitraScreen', { mitra: item })} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchMitra}
        refreshing={loading}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center justify-center py-8">
              <Text className="text-gray-500 dark:text-gray-400 text-lg font-medium text-center">
                {allMitra.length === 0 ? 'Belum ada mitra UMKM terdaftar' : 'Tidak ada mitra UMKM yang sesuai dengan pencarian'}
              </Text>
              <Text className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                {allMitra.length === 0 ? 'Data mitra UMKM akan muncul di sini setelah ada yang mendaftar' : 'Coba ubah kata kunci atau filter pencarian'}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: { paddingHorizontal: 16, paddingBottom: 16 },
});

export default ManajemenMitraScreen;
