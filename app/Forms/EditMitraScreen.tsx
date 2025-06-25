import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FormInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  [key: string]: any;
};

const FormInput: React.FC<FormInputProps> = ({ label, value, onChangeText, ...props }) => (
  <View className="mb-4">
    <Text className="text-base text-gray-600 mb-2">{label}</Text>
    <TextInput
      className="border border-gray-300 rounded-lg p-3 text-base"
      value={value}
      onChangeText={onChangeText}
      {...props}
    />
  </View>
);






const EditMitraScreen: React.FC<any> = ({ route, navigation }) => {
  const { mitra } = route.params;

  const [namaUser, setNamaUser] = useState(mitra.nama_user);
  const [email, setEmail] = useState(mitra.email);
  const [nohp, setNohp] = useState(mitra.nohp);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const body = JSON.stringify({
        nama_user: namaUser,
        email: email,
        nohp: nohp,
      });

      const response = await fetch(`https://ekraf.asepharyana.tech/api/users/${mitra.id_user}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui data');
      }

      Alert.alert('Sukses', 'Data mitra berhasil diperbarui.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus mitra "${mitra.nama_user}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: handleDelete },
      ]
    );
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`https://ekraf.asepharyana.tech/api/users/${mitra.id_user}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus data');
      }

      Alert.alert('Sukses', 'Data mitra berhasil dihapus.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: 20,
      flexGrow: 1,
    },
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={styles.container}>
        <Text className="text-3xl font-bold text-slate-800 mb-6">Edit Mitra</Text>

        <FormInput
          label="Nama Lengkap"
          value={namaUser}
          onChangeText={setNamaUser}
          placeholder="Masukkan nama lengkap"
        />
        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Masukkan email"
          keyboardType="email-address"
        />
        <FormInput
          label="Nomor HP"
          value={nohp}
          onChangeText={setNohp}
          placeholder="Masukkan nomor HP"
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          onPress={handleUpdate}
          className="bg-yellow-500 p-4 rounded-lg items-center justify-center mt-4"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Update Data</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={confirmDelete}
          className="bg-red-600 p-4 rounded-lg items-center justify-center mt-3"
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">Hapus Mitra</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-gray-200 p-4 rounded-lg items-center justify-center mt-3"
          disabled={loading}
        >
          <Text className="text-gray-800 text-lg font-bold">Batal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditMitraScreen;
