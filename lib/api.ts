// lib/api.ts

import axios, {AxiosInstance} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as T from './types';
import {Asset} from 'react-native-image-picker';

// API Base URLs from OpenAPI spec
const API_BASE_URL = 'https://ekraf.asepharyana.tech/api';

// --- SETUP AXIOS & HELPERS ---
const publicClient = axios.create({baseURL: API_BASE_URL});
const privateClient: AxiosInstance = axios.create({baseURL: API_BASE_URL});

privateClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(new Error(error)),
);

const handleError = (error: any, context: string): never => {
  console.error(`API Error in ${context}:`, JSON.stringify(error, null, 2));
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      throw new Error(
        'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
      );
    }
    throw new Error(error.response.data.message ?? `Gagal ${context}.`);
  }
  throw new Error(`Terjadi kesalahan tidak terduga saat ${context}.`);
};

// ===================================
// PRODUCTS API - Sesuai dengan OpenAPI spec
// ===================================
export const productsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    q?: string;
    kategori?: number;
    subsector?: number;
  }) =>
    publicClient
      .get<{
        message: string;
        totalPages: number;
        currentPage: number;
        data: T.Product[];
      }>('/products', {params})
      .then(res => res.data)
      .catch(e => handleError(e, 'mengambil daftar produk')),

  getById: (id: number) =>
    publicClient
      .get<{message: string; data: T.Product}>(`/products/${id}`)
      .then(res => res.data.data)
      .catch(e => handleError(e, `mengambil produk #${id}`)),

  create: (data: T.ProductPayload) =>
    privateClient
      .post<{message: string; data: T.Product}>('/products', data)
      .then(res => res.data)
      .catch(e => handleError(e, 'membuat produk')),

  update: (id: number, data: T.UpdateProductPayload) =>
    privateClient
      .put<{message: string; data: T.Product}>(`/products/${id}`, data)
      .then(res => res.data)
      .catch(e => handleError(e, `memperbarui produk #${id}`)),

  delete: (id: number) =>
    privateClient
      .delete<{message: string}>(`/products/${id}`)
      .then(res => res.data)
      .catch(e => handleError(e, `menghapus produk #${id}`)),

  // Online store links management - sesuai OpenAPI
  createLink: (productId: number, data: T.CreateOnlineStoreLinkData) =>
    privateClient
      .post<{message: string; data: T.OnlineStoreLink}>(`/products/${productId}/links`, data)
      .then(res => res.data)
      .catch(e => handleError(e, `menambah link ke produk #${productId}`)),

  updateLink: (
    productId: number,
    linkId: number,
    data: T.UpdateOnlineStoreLinkData,
  ) =>
    privateClient
      .put<{message: string; data: T.OnlineStoreLink}>(
        `/products/${productId}/links/${linkId}`,
        data,
      )
      .then(res => res.data)
      .catch(e => handleError(e, `memperbarui link #${linkId}`)),
};

// ===================================
// AUTH API - Updated to match OpenAPI spec
// ===================================
export const authApi = {
  login: (
    d: {u: string; p: string},
    l: 'superadmin' | 'admin' | 'umkm' = 'umkm',
  ) =>
    publicClient
      .post<T.LoginSuccessResponse>(`/auth/login/${l}`, {
        usernameOrEmail: d.u,
        password: d.p,
      })
      .then(async res => {
        await AsyncStorage.setItem('userToken', res.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(res.data.user));
        return res.data;
      })
      .catch(e => handleError(e, 'melakukan login')),

  register: (data: T.RegistrationData) =>
    publicClient
      .post<T.RegisterResponse>('/auth/register/umkm', data)
      .then(res => res.data)
      .catch(e => handleError(e, 'melakukan registrasi')),

  forgotPassword: (data: T.ForgotPasswordRequest) =>
    publicClient
      .post<T.ForgotPasswordResponse>('/auth/forgot-password', data)
      .then(res => res.data)
      .catch(e => handleError(e, 'meminta reset password')),

  resetPassword: (data: T.ResetPasswordRequest) =>
    publicClient
      .post<T.ResetPasswordResponse>('/auth/reset-password', data)
      .then(res => res.data)
      .catch(e => handleError(e, 'mereset password')),

  verifyEmail: (data: T.VerifyEmailRequest) =>
    publicClient
      .post<T.VerifyEmailResponse>('/auth/verify-email', data)
      .then(res => res.data)
      .catch(e => handleError(e, 'memverifikasi email')),
};
// ===================================
// UPLOADER API - External service for file uploads
// ===================================
export const uploaderApi = {
  uploadImage: async (imageAsset: Asset): Promise<string> => {
    const uploaderUrl = 'https://apidl.asepharyana.cloud/api/uploader/ryzencdn';

    if (!imageAsset.uri || !imageAsset.fileName || !imageAsset.type) {
      throw new Error('Data gambar tidak lengkap untuk diunggah.');
    }

    const formData = new FormData();
    formData.append('file', {
      uri: imageAsset.uri,
      type: imageAsset.type,
      name: imageAsset.fileName,
    } as any);

    try {
      const uploadResponse = await fetch(uploaderUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const result: T.UploaderResponse = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error('Gagal mengunggah gambar ke server.');
      }

      if (result.url) {
        return result.url;
      } else {
        throw new Error('Respons server tidak valid setelah upload.');
      }
    } catch (error) {
      return handleError(error, 'mengunggah gambar');
    }
  },
};

// ===================================
// MASTER DATA API - Sesuai dengan OpenAPI spec
// ===================================
export const masterDataApi = {
  getBusinessCategories: () =>
    publicClient
      .get<{message: string; data: T.BusinessCategory[]}>('/master-data/business-categories')
      .then(res => res.data.data)
      .catch(e => handleError(e, 'mengambil kategori usaha')),

  getUserLevels: () =>
    publicClient
      .get<{message: string; data: T.Level[]}>('/master-data/levels')
      .then(res => res.data.data)
      .catch(e => handleError(e, 'mengambil level pengguna')),

  getSubsectors: () =>
    publicClient
      .get<{message: string; data: T.Subsector[]}>('/master-data/subsectors')
      .then(res => res.data.data)
      .catch(e => handleError(e, 'mengambil subsektor')),
};

// ===================================
// USERS API - Sesuai dengan OpenAPI spec
// ===================================
export const usersApi = {
  getOwnProfile: () =>
    privateClient
      .get<{message: string; data: T.UserProfile}>('/users/profile')
      .then(res => res.data.data)
      .catch(e => handleError(e, 'mengambil profil')),

  getAll: () =>
    privateClient
      .get<{message: string; data: T.User[]}>('/users')
      .then(res => res.data.data)
      .catch(e => handleError(e, 'mengambil daftar pengguna')),

  getById: (id: string) => // Ubah ke string sesuai OpenAPI
    privateClient
      .get<{message: string; data: T.User}>(`/users/${id}`)
      .then(res => res.data.data)
      .catch(e => handleError(e, `mengambil pengguna #${id}`)),

  update: (id: string, data: Partial<T.User>) => // Ubah ke string sesuai OpenAPI
    privateClient
      .put<{message: string}>(`/users/${id}`, data)
      .then(res => res.data)
      .catch(e => handleError(e, `memperbarui pengguna #${id}`)),

  delete: (id: string) => // Ubah ke string sesuai OpenAPI
    privateClient
      .delete<{message: string}>(`/users/${id}`)
      .then(res => res.data)
      .catch(e => handleError(e, `menghapus pengguna #${id}`)),

  getProducts: (userId: string) => // Ubah ke string sesuai OpenAPI
    privateClient
      .get<{message: string; data: T.Product[]}>(`/users/${userId}/products`)
      .then(res => res.data.data)
      .catch(e => handleError(e, `mengambil produk pengguna #${userId}`)),

  getArticles: (userId: string) => // Ubah ke string sesuai OpenAPI
    privateClient
      .get<{message: string; data: T.Article[]}>(`/users/${userId}/articles`)
      .then(res => res.data.data)
      .catch(e => handleError(e, `mengambil artikel pengguna #${userId}`)),
};

// ===================================
// ARTICLES API - Sesuai dengan OpenAPI spec
// ===================================
export const articlesApi = {
  getAll: () =>
    privateClient
      .get<{message: string; data: T.Article[]}>('/articles')
      .then(res => res.data.data)
      .catch(e => handleError(e, 'mengambil daftar artikel')),

  create: (data: T.CreateArticleData) =>
    privateClient
      .post<{message: string; data: T.Article}>('/articles', data)
      .then(res => res.data)
      .catch(e => handleError(e, 'membuat artikel')),

  getById: (id: number) =>
    privateClient
      .get<{message: string; data: T.Article}>(`/articles/${id}`)
      .then(res => res.data.data)
      .catch(e => handleError(e, `mengambil artikel #${id}`)),

  update: (id: number, data: T.UpdateArticleData) =>
    privateClient
      .put<{message: string; data: T.Article}>(`/articles/${id}`, data)
      .then(res => res.data)
      .catch(e => handleError(e, `memperbarui artikel #${id}`)),

  delete: (id: number) =>
    privateClient
      .delete<{message: string}>(`/articles/${id}`)
      .then(res => res.data)
      .catch(e => handleError(e, `menghapus artikel #${id}`)),
};

// ===================================
// KATEGORI USAHA API - Legacy, masih digunakan di beberapa komponen
// ===================================
export const kategoriUsahaApi = {
  /**
   * Membuat kategori usaha baru.
   */
  create: (data: T.KategoriUsahaPayload) =>
    privateClient
      .post<{message: string; data: T.KategoriUsaha}>('/business-categories', data)
      .then(res => res.data)
      .catch(e => handleError(e, 'membuat kategori usaha')),

  getById: (id: number) =>
    publicClient
      .get<{message: string; data: T.KategoriUsaha}>(`/business-categories/${id}`)
      .then(res => res.data.data)
      .catch(e => handleError(e, `mengambil kategori usaha #${id}`)),

  /**
   * Memperbarui kategori usaha. Menerima data parsial.
   */
  update: (id: number, data: Partial<T.KategoriUsahaPayload>) =>
    privateClient
      .put<{message: string; data: T.KategoriUsaha}>(`/business-categories/${id}`, data)
      .then(res => res.data)
      .catch(e => handleError(e, `memperbarui kategori usaha #${id}`)),

  /**
   * Menghapus kategori usaha.
   */
  delete: (id: number) =>
    privateClient
      .delete<{message: string}>(`/business-categories/${id}`)
      .then(res => res.data)
      .catch(e => handleError(e, `menghapus kategori usaha #${id}`)),
};

// ===================================
// SUBSECTORS API - Sesuai dengan OpenAPI spec
// ===================================
export const subsectorsApi = {
  getAll: () =>
    publicClient
      .get<{message: string; data: T.SubSector[]}>('/subsectors')
      .then(res => res.data.data)
      .catch(e => handleError(e, 'mengambil daftar subsektor')),

  getById: (id: string) =>
    publicClient
      .get<{message: string; data: T.SubSector}>(`/subsectors/${id}`)
      .then(res => res.data.data)
      .catch(e => handleError(e, `mengambil subsektor #${id}`)),

  create: (data: {title: string}) =>
    privateClient
      .post<{message: string; data: T.SubSector}>('/subsectors', data)
      .then(res => res.data)
      .catch(e => handleError(e, 'membuat subsektor')),

  update: (id: string, data: {title: string}) =>
    privateClient
      .put<{message: string; data: T.SubSector}>(`/subsectors/${id}`, data)
      .then(res => res.data)
      .catch(e => handleError(e, `memperbarui subsektor #${id}`)),

  delete: (id: string) =>
    privateClient
      .delete<{message: string}>(`/subsectors/${id}`)
      .then(res => res.data)
      .catch(e => handleError(e, `menghapus subsektor #${id}`)),
};

// ===================================
// BUSINESS CATEGORIES API - Sesuai dengan OpenAPI spec
// ===================================
export const businessCategoriesApi = {
  getAll: () =>
    publicClient
      .get<{message: string; data: T.BusinessCategory[]}>('/business-categories')
      .then(res => res.data.data)
      .catch(e => handleError(e, 'mengambil kategori usaha')),

  getById: (id: number) =>
    publicClient
      .get<{message: string; data: T.BusinessCategory}>(`/business-categories/${id}`)
      .then(res => res.data.data)
      .catch(e => handleError(e, `mengambil kategori usaha #${id}`)),

  create: (data: {name: string; image?: string; sub_sector_id: string; description?: string}) =>
    privateClient
      .post<{message: string; data: T.BusinessCategory}>('/business-categories', data)
      .then(res => res.data)
      .catch(e => handleError(e, 'membuat kategori usaha')),

  update: (id: number, data: Partial<{name: string; image?: string; sub_sector_id: string; description?: string}>) =>
    privateClient
      .put<{message: string; data: T.BusinessCategory}>(`/business-categories/${id}`, data)
      .then(res => res.data)
      .catch(e => handleError(e, `memperbarui kategori usaha #${id}`)),

  delete: (id: number) =>
    privateClient
      .delete<{message: string}>(`/business-categories/${id}`)
      .then(res => res.data)
      .catch(e => handleError(e, `menghapus kategori usaha #${id}`)),
};
