// screens/admin/ManajemenProdukScreen.tsx

import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../Context/ThemeContext';
import { productsApi } from '../../lib/api';
import { Product, UpdateProductPayload } from '../../lib/types';

// Tipe untuk Navigasi
type ProductNavProp = NavigationProp<{
  FormProdukScreen: { product?: Product };
}>;

// Tipe dan Opsi untuk Status Produk
type ProductStatus = Product['status_produk'];
const statusOptions: { label: string; value: ProductStatus; icon: string; color: string; }[] = [
    { label: 'Disetujui', value: 'disetujui', icon: 'check-circle', color: '#10B981' },
    { label: 'Pending', value: 'pending', icon: 'clock', color: '#F59E0B' },
    { label: 'Ditolak', value: 'ditolak', icon: 'x-circle', color: '#EF4444' },
    { label: 'Tidak aktif', value: 'tidak_aktif', icon: 'pause-circle', color: '#6B7280' },
];

/**
 * Komponen StatPill untuk statistik produk
 */
const StatPill = ({ count, label, color }: { count: number, label: string, color: string }) => (
    <View className={`flex-1 items-center p-2 rounded-lg ${color}`}>
        <Text className="text-xl font-bold text-white">{count}</Text>
        <Text className="text-xs text-white">{label}</Text>
    </View>
);

/**
 * Komponen Header dengan Statistik Produk
 */
const HeaderStats = ({ products }: { products: Product[] }) => {
    const stats = useMemo(() => {
        const active = products.filter(p => p.status_produk === 'disetujui').length;
        const pending = products.filter(p => p.status_produk === 'pending').length;
        const inactive = products.length - active - pending;
        return { active, pending, inactive };
    }, [products]);

    return (
        <View className="px-4 pb-4 space-y-2">
            <View className="flex-row gap-2">
                <StatPill count={stats.active} label="Disetujui" color="bg-green-500" />
                <StatPill count={stats.pending} label="Pending" color="bg-yellow-500" />
                <StatPill count={stats.inactive} label="Lainnya" color="bg-gray-500" />
            </View>
        </View>
    );
};


/**
 * Komponen Kartu Produk dengan UI yang disempurnakan
 */
const ProductCard = ({ product, onEdit, onDelete, onStatusChange, isUpdatingStatus }: { product: Product; onEdit: () => void; onDelete: () => void; onStatusChange: () => void; isUpdatingStatus: boolean; }) => {
    // Prioritaskan status_produk, lalu status, lalu default ke pending
    const currentStatus = product.status_produk || product.status || 'pending';
    
    // DEBUG: Log render ProductCard dengan lebih detail
    console.log(`🎨 [PRODUCT CARD] ID:${product.id} - Render with status:`, {
        productId: product.id,
        productName: product.name,
        status_produk: product.status_produk,
        status: product.status,
        resolvedStatus: currentStatus,
        isUpdatingStatus,
        timestamp: Date.now()
    });
    
    const statusInfo = statusOptions.find(opt => opt.value === currentStatus) ?? { 
        container: 'bg-gray-100 dark:bg-gray-700', 
        text: 'text-gray-600 dark:text-gray-400', 
        label: 'Unknown', 
        color: '#6B7280', 
        icon: 'help-circle' 
    };
    
    // DEBUG: Log status info yang digunakan
    console.log('🎯 [PRODUCT CARD] Status Info:', {
        productId: product.id,
        currentStatus,
        statusLabel: statusInfo.label,
        statusColor: statusInfo.color
    });

    return (
        <View className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm mb-4 overflow-hidden">
            <Image source={{ uri: product.image ?? 'https://placehold.co/600x400/e2e8f0/e2e8f0' }} className="w-full h-40" resizeMode="cover" />
            <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 flex-1 pr-2" numberOfLines={2}>{product.name}</Text>
                    {/* Tombol status dengan penanda visual (chevron-down) */}
                    <TouchableOpacity onPress={onStatusChange} disabled={isUpdatingStatus} style={{ backgroundColor: statusInfo.color }} className={'px-3 py-1.5 rounded-full flex-row items-center'}>
                        {isUpdatingStatus ? <ActivityIndicator size="small" color="white" /> : <><Icon name={statusInfo.icon} size={14} color="white" /><Text className={'font-semibold text-xs text-white ml-1.5'}>{statusInfo.label}</Text><Icon name="chevron-down" size={16} color="white" className="ml-1 opacity-75" /></>}
                    </TouchableOpacity>
                </View>
                <Text className="text-sm text-gray-500 dark:text-gray-400">Oleh: {product.users?.name ?? product.owner_name}</Text>
                <View className="flex-row justify-between items-center mt-3">
                    <Text className="text-base font-bold text-yellow-500">Rp {(product.price ?? 0).toLocaleString('id-ID')}</Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-300">Stok: {product.stock ?? 0}</Text>
                </View>
            </View>
            <View className="flex-row border-t border-gray-100 dark:border-zinc-700">
                <TouchableOpacity onPress={onEdit} className="flex-1 p-3 items-center justify-center flex-row border-r border-gray-100 dark:border-zinc-700"><Icon name="edit" size={16} color="#6B7280" /><Text className="ml-2 text-gray-600 dark:text-gray-300 font-semibold">Edit</Text></TouchableOpacity>
                <TouchableOpacity onPress={onDelete} className="flex-1 p-3 items-center justify-center flex-row"><Icon name="trash-2" size={16} color="#EF4444" /><Text className="ml-2 text-red-500 font-semibold">Hapus</Text></TouchableOpacity>
            </View>
        </View>
    );
};


const ManajemenProdukScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<ProductNavProp>();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [renderKey, setRenderKey] = useState<number>(0); // Untuk memaksa re-render

  const memoizedProducts = useMemo(() => {
    console.log('🔄 Products memoized, count:', products.length);
    return products;
  }, [products]); // Hanya bergantung pada products, bukan renderKey

  const fetchProducts = useCallback(async (currentPage: number, isRefresh: boolean) => {
    // Cegah fetch jika baru saja ada update status (dalam 500ms terakhir, bukan 2 detik)
    const timeSinceLastUpdate = Date.now() - lastUpdateTime;
    if (timeSinceLastUpdate < 500 && isRefresh) {
      console.log('⏭️ Skipping fetch, very recent status update');
      return;
    }
    
    if(isRefresh) {setLoading(true);} // Tampilkan loading utama hanya saat refresh
    setError(null);

    try {
      const response = await productsApi.getAll({ page: currentPage, limit: 10, q: searchQuery });
      if (currentPage === 1) {
        setProducts(response.data);
      } else {
        setProducts(prev => [...prev, ...response.data]);
      }
      setTotalPages(response.totalPages);
      
      // Update render key untuk memaksa re-render
      setRenderKey(prev => prev + 1);
      
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, lastUpdateTime]); // Tambahkan lastUpdateTime sebagai dependency

  // Initial load, search, dan refresh
  useFocusEffect(useCallback(() => {
      setPage(1);
      // Jangan refresh otomatis jika sedang dalam proses update status
      if (updatingStatusId === null) {
        fetchProducts(1, true);
      }
  }, [fetchProducts, updatingStatusId]));

  // Load more data when page changes
  useEffect(() => {
      if (page > 1) {
          fetchProducts(page, false);
      }
  }, [fetchProducts, page]);


  const handleUpdateStatus = async (newStatus: ProductStatus) => {
    if (!selectedProduct || !newStatus) {
      return;
    }
    
    console.log('🔄 [STATUS UPDATE] Starting:', {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      currentStatus: selectedProduct.status_produk,
      newStatus: newStatus
    });
    
    setIsStatusModalVisible(false);
    setUpdatingStatusId(selectedProduct.id);
    
    try {
      // PERBAIKAN: Gunakan FULL PAYLOAD sesuai OpenAPI specification
      // Backend memerlukan semua field required, bukan hanya status
      const fullPayload: UpdateProductPayload = {
        name: selectedProduct.name,
        description: selectedProduct.description || '',
        price: selectedProduct.price || 0,
        stock: selectedProduct.stock || 0,
        phone_number: selectedProduct.phone_number || '',
        business_category_id: selectedProduct.business_category_id || 1,
        image: selectedProduct.image || '',
        status_produk: newStatus, // Field yang ingin diubah
        status: newStatus, // Backup field
      };
      
      // Tambahkan field opsional jika ada
      if (selectedProduct.owner_name) {
        fullPayload.owner_name = selectedProduct.owner_name;
      }
      if (selectedProduct.sub_sector_id) {
        fullPayload.sub_sector_id = selectedProduct.sub_sector_id;
      }
      
      console.log('📤 [STATUS UPDATE] Sending FULL payload:', JSON.stringify(fullPayload, null, 2));
      
      const response = await productsApi.update(selectedProduct.id, fullPayload);
      
      console.log('📥 [STATUS UPDATE] Response:', response);
      
      if (response && response.data) {
        console.log('✅ [SUCCESS] API response received, updating UI immediately...');
        
        // Update state LANGSUNG tanpa callback yang rumit
        const currentProducts = [...products];
        const productIndex = currentProducts.findIndex(p => p.id === selectedProduct.id);
        
        if (productIndex !== -1) {
          // Update produk langsung di array
          currentProducts[productIndex] = {
            ...currentProducts[productIndex],
            status_produk: newStatus,
            status: newStatus
          };
          
          console.log('🔄 [DIRECT UPDATE] Updated product at index:', productIndex);
          console.log('� [DIRECT UPDATE] New status:', newStatus);
          
          // Set products dengan array yang sudah diupdate
          setProducts(currentProducts);
        }
        
        console.log('✅ [SUCCESS] Status update completed successfully');
        
      } else {
        throw new Error('Response tidak valid');
      }
      
    } catch (error: any) {
      console.error('❌ [STATUS UPDATE] PUT method failed:', error);
      
      // FALLBACK: Coba PATCH method untuk partial update
      console.log('🔄 [FALLBACK] Trying PATCH method...');
      
      try {
        const patchPayload = {
          status_produk: newStatus,
          status: newStatus
        };
        
        console.log('📤 [PATCH UPDATE] Sending patch payload:', patchPayload);
        
        const patchResponse = await productsApi.updatePartial(selectedProduct.id, patchPayload);
        
        console.log('📥 [PATCH UPDATE] Response:', patchResponse);
        
        if (patchResponse && patchResponse.data) {
          console.log('✅ [PATCH SUCCESS] API response received, updating UI immediately...');
          
          // Update state LANGSUNG untuk PATCH juga
          const currentProducts = [...products];
          const productIndex = currentProducts.findIndex(p => p.id === selectedProduct.id);
          
          if (productIndex !== -1) {
            currentProducts[productIndex] = {
              ...currentProducts[productIndex],
              status_produk: newStatus,
              status: newStatus
            };
            
            console.log('🔄 [PATCH DIRECT UPDATE] Updated product at index:', productIndex);
            setProducts(currentProducts);
          }
          
          console.log('✅ [PATCH SUCCESS] Status update completed via PATCH method');
          
        } else {
          throw new Error('PATCH response tidak valid');
        }
        
      } catch (patchError: any) {
        console.error('❌ [PATCH UPDATE] PATCH method also failed:', patchError);
        Alert.alert('Error', 'Gagal mengubah status: ' + (error.message || 'Unknown error'));
        
        // Refresh pada error untuk melihat status asli dari database
        fetchProducts(1, true);
      }
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const openStatusModal = (product: Product) => { 
    console.log('📝 [MODAL] Opening status modal for:', {
      id: product.id,
      name: product.name,
      currentStatus: product.status_produk || product.status
    });
    setSelectedProduct(product); 
    setIsStatusModalVisible(true); 
  };
  const handleDelete = (productId: number) => { Alert.alert( 'Hapus Produk', 'Apakah Anda yakin?', [{ text: 'Batal' }, { text: 'Hapus', style: 'destructive', onPress: async () => { try { await productsApi.delete(productId); setProducts(p => p.filter(i => i.id !== productId)); } catch (e: any) { Alert.alert('Error', e.message); }}}]);};
  const handleLoadMore = () => { if (page < totalPages && !loading) { setPage(p => p + 1); } };

  const placeholderColor = isDark ? '#9CA3AF' : '#6B7281';

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-zinc-900">
      <View className="p-4"/>
      <FlatList
        data={memoizedProducts}
        ListHeaderComponent={
            <>
                <HeaderStats products={memoizedProducts} />
                <View className="flex-row p-4 pt-0 items-center gap-2">
                    <View className="flex-1 bg-white dark:bg-zinc-800 rounded-lg border border-gray-300 dark:border-zinc-700 flex-row items-center">
                        <Icon name="search" size={20} color={placeholderColor} className="ml-3" />
                        <TextInput placeholder="Cari produk..." onSubmitEditing={() => {setPage(1); fetchProducts(1, true);}} placeholderTextColor={placeholderColor} value={searchQuery} onChangeText={setSearchQuery} className="text-base flex-1 text-black dark:text-white h-12 px-2" />
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('FormProdukScreen', {})} className="bg-yellow-500 p-2.5 rounded-full shadow-md">
                              <Icon name="plus" size={22} color="white" />
                            </TouchableOpacity>
                </View>
                {error && <View className="px-4"><Text className="text-red-500 text-center">{error}</Text></View>}
            </>
        }
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onEdit={() => navigation.navigate('FormProdukScreen', { product: item })} 
            onDelete={() => handleDelete(item.id)} 
            onStatusChange={() => openStatusModal(item)} 
            isUpdatingStatus={updatingStatusId === item.id} 
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        extraData={products} // Force re-render when products change
        contentContainerStyle={styles.contentContainer}
        onRefresh={() => {setPage(1); fetchProducts(1, true);}}
        refreshing={loading && page === 1}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && page > 1 ? <ActivityIndicator size="large" color="#FBBF24" className="my-4" /> : null}
        ListEmptyComponent={!loading && !error ? <View className="items-center justify-center mt-20"><Text className="text-gray-500 dark:text-gray-400">Tidak ada produk ditemukan.</Text></View> : null}
      />

      <Modal transparent={true} visible={isStatusModalVisible} animationType="slide" onRequestClose={() => setIsStatusModalVisible(false)}>
        <Pressable onPress={() => setIsStatusModalVisible(false)} style={styles.modalOverlay}>
          <Pressable className="w-full bg-white dark:bg-zinc-800 rounded-t-2xl absolute bottom-0 pb-6">
            <View className="w-12 h-1.5 bg-gray-300 dark:bg-zinc-600 rounded-full self-center my-3" />
            <Text className="text-lg font-bold p-4 pt-0 text-center text-gray-800 dark:text-gray-200">Ubah Status Produk</Text>
            {statusOptions.map((option) => {
              const currentStatus = selectedProduct?.status_produk || selectedProduct?.status;
              const isSelected = currentStatus === option.value;
              
              console.log('🎯 Status option render:', {
                optionValue: option.value,
                optionLabel: option.label,
                selectedProduct_status_produk: selectedProduct?.status_produk,
                selectedProduct_status: selectedProduct?.status,
                currentStatus: currentStatus,
                isSelected: isSelected,
                selectedProductId: selectedProduct?.id
              });
              
              return(
              <TouchableOpacity key={option.value} onPress={() => {
                console.log('👆 [MODAL] Status option clicked:', {
                  selectedValue: option.value,
                  selectedLabel: option.label,
                  productId: selectedProduct?.id,
                  productName: selectedProduct?.name
                });
                handleUpdateStatus(option.value);
              }} className="p-4 flex-row items-center border-t border-gray-100 dark:border-zinc-700">
                <Icon name={option.icon} size={22} color={isSelected ? option.color : (isDark ? '#FFF' : '#000')} />
                <Text className={`text-lg ml-4 ${isSelected ? 'font-bold' : 'font-normal'}`} style={{color: isSelected ? option.color : (isDark ? '#FFF' : '#000')}}>{option.label}</Text>
                {isSelected && <Icon name="check" size={22} color={option.color} className="ml-auto" />}
              </TouchableOpacity>
            );})}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
});

export default ManajemenProdukScreen;
