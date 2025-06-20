import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const StatCard = ({ count, label, color }) => (
  <View className={`flex-1 items-center p-3 rounded-xl shadow-md ${color}`}>
    <Text className="text-2xl font-bold text-white">{count}</Text>
    <Text className="text-sm text-white text-center">{label}</Text>
  </View>
);

const FilterButton = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-5 py-2 rounded-full border border-gray-300 ${isActive ? 'bg-yellow-500 border-yellow-500' : 'bg-white'}`}
  >
    <Text className={`${isActive ? 'text-white' : 'text-gray-600'} font-semibold`}>{label}</Text>
  </TouchableOpacity>
);

const formatDate = (dateString) => {
  if (!dateString) return 'Belum Verifikasi';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const MitraCard = ({ mitra, onPress }) => {
  const isActive = !!mitra.verifiedAt;
  const initial = mitra.nama_user ? mitra.nama_user.charAt(0).toUpperCase() : '?';

  return (
    <TouchableOpacity onPress={onPress} className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mr-4">
          <Text className="text-gray-600 text-xl font-bold">{initial}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>{mitra.nama_user}</Text>
          <Text className="text-sm text-gray-500">{mitra.email}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${isActive ? 'bg-green-100' : 'bg-red-100'}`}>
          <Text className={`font-semibold ${isActive ? 'text-green-600' : 'text-red-600'}`}>
            {isActive ? 'Aktif' : 'Non-Aktif'}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-100">
        <View>
          <Text className="text-sm text-gray-500">Fashion & Aksesoris</Text>
          <Text className="text-sm text-gray-500">10 produk</Text>
        </View>
        <View className="items-end">
          <Text className="text-sm text-gray-500">{formatDate(mitra.verifiedAt)}</Text>
          <Text className="text-sm text-gray-500">{mitra.nohp}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ManajemenMitraScreen = () => {
  const navigation = useNavigation();
  const [allMitra, setAllMitra] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMitra = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token tidak ditemukan');
      
      const response = await fetch('https://ekraf.asepharyana.tech/api/users', {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Gagal mengambil data mitra');
      
      const result = await response.json();
      const umkmUsers = result.data.filter(user => user.tbl_level.level === 'UMKM');
      setAllMitra(umkmUsers);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMitra();
    }, [fetchMitra])
  );
  
  const filteredMitra = useMemo(() => {
    return allMitra
      .filter(mitra => {
        if (filter === 'Aktif') return !!mitra.verifiedAt;
        if (filter === 'NonAktif') return !mitra.verifiedAt;
        return true;
      })
      .filter(mitra =>
        mitra.nama_user.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [allMitra, filter, searchQuery]);

  const stats = useMemo(() => {
    const total = allMitra.length;
    const aktif = allMitra.filter(m => !!m.verifiedAt).length;
    const nonAktif = total - aktif;
    return { total, aktif, nonAktif };
  }, [allMitra]);

  if (loading && !allMitra.length) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#FBBF24" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500 text-center">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <FlatList
        ListHeaderComponent={
          <>
            <View className="px-4 pt-4 pb-2">
                <Text className="text-3xl font-bold text-slate-800">Manajemen Mitra</Text>
            </View>
            <View className="bg-yellow-400 rounded-2xl mx-4 p-4 shadow-md">
              <Text className="text-xl font-bold text-white">Admin Panel</Text>
              <Text className="text-sm text-white mb-4">Dashboard / Daftar Mitra</Text>
              <View className="flex-row justify-between space-x-3">
                <StatCard count={stats.total} label="Total Mitra" color="bg-yellow-500" />
                <StatCard count={stats.aktif} label="Aktif" color="bg-yellow-500" />
                <StatCard count={stats.nonAktif} label="Non-aktif" color="bg-yellow-500" />
              </View>
            </View>
            <View className="p-4 bg-gray-100">
              <View className="bg-white p-2 rounded-lg border border-gray-300 flex-row items-center">
                <TextInput
                  placeholder="Cari Mitra"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="text-base flex-1"
                />
              </View>
              <View className="flex-row space-x-2 mt-4">
                <FilterButton label="Semua" isActive={filter === 'Semua'} onPress={() => setFilter('Semua')} />
                <FilterButton label="Aktif" isActive={filter === 'Aktif'} onPress={() => setFilter('Aktif')} />
                <FilterButton label="NonAktif" isActive={filter === 'NonAktif'} onPress={() => setFilter('NonAktif')} />
              </View>
              <Text className="text-xl font-bold text-gray-800 mt-6 mb-2">Daftar Mitra</Text>
            </View>
          </>
        }
        data={filteredMitra}
        renderItem={({ item }) => (
          <MitraCard 
            mitra={item} 
            onPress={() => navigation.navigate('EditMitra', { mitra: item })}
          />
        )}
        keyExtractor={item => item.id_user.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchMitra}
        refreshing={loading}
      />
    </SafeAreaView>
  );
};

export default ManajemenMitraScreen;