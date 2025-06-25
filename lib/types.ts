// lib/types.ts

// ===================================
// TIPE DATA - GENERIC & PAGINASI
// ===================================
// Wrapper standar untuk respons API yang mengembalikan data tunggal atau array
export interface ApiResponse<T> {
  message: string;
  data: T;
  success?: boolean;
}

// Wrapper untuk respons yang hanya berisi pesan (cth: delete)
export interface ApiMessageResponse {
    message: string;
    success?: boolean;
}

// Wrapper untuk respons dengan paginasi
export interface PaginatedApiResponse<T> {
  message: string;
  totalPages: number;
  currentPage: number;
  data: T;
}

export interface UploaderResponse {
  url: string;
}
// ===================================
// TIPE DATA - AUTH & USERS
// ===================================
export interface User {
  id_user: number;
  id_level: number;
  nama_user: string | null;
  jk: 'Laki-laki' | 'Perempuan';
  nohp: string | null;
  username: string;
  email: string | null;
  nama_usaha?: string;
  status_usaha?: 'BARU' | 'SUDAH_LAMA';
  verifiedAt?: string | null;
  tbl_level?: { id_level?: number; level: string; };
  tbl_kategori_usaha?: KategoriUsaha | null;
  level?: string;
  productCount?: number;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegistrationData {
  nama_user: string;
  username: string;
  email: string;
  password: string;
  jk: 'Laki-laki' | 'Perempuan';
  nohp: string;
  nama_usaha?: string;
  status_usaha?: 'BARU' | 'SUDAH_LAMA';
  id_kategori_usaha?: string;
}

export interface RegisterResponse {
  message: string;
  success: boolean;
}

export interface ForgotPasswordResponse {
  message: string;
}


// ===================================
// TIPE DATA - MASTER DATA & KATEGORI
// ===================================
export interface KategoriUsaha {
  id_kategori_usaha: number;
  nama_kategori: string;
  image: string;
}

export interface TblLevel {
    id_level: number;
    level: string;
}

export interface Subsektor {
    id_sub: number;
    sub_sektor: string;
}


// ===================================
// TIPE DATA - PRODUCTS
// ===================================

export interface Product {
  id_produk: number;
  nama_produk: string;
  nama_pelaku: string;
  deskripsi: string;
  harga: number;
  stok: number;
  nohp: string | null;
  id_kategori_usaha: number;
  gambar: string;
  id_user: number;
  // TAMBAHKAN BARIS DI BAWAH INI
  status_produk: 'disetujui' | 'pending' | 'ditolak' | 'tidak aktif';
  tbl_kategori_usaha?: KategoriUsaha;
  tbl_user?: { nama_user: string; };
  tbl_olshop_link?: OlshopLink[];
}
export interface ProductPayload {
  nama_produk: string;
  nama_pelaku: string;
  deskripsi?: string;
  harga: number; // tipe data number untuk JSON
  stok: number;  // tipe data number untuk JSON
  nohp?: string;
  id_kategori_usaha: number;
  gambar: string; // Tipe data string untuk URL gambar
  status_produk?: 'disetujui' | 'pending' | 'ditolak' | 'tidak aktif';
}
export interface OlshopLink {
    id_link: number;
    nama_platform: string;
    url: string;
    id_produk: number;
}

export interface CreateOlshopLinkData {
    nama_platform: string;
    url: string;
}

export type UpdateOlshopLinkData = Partial<CreateOlshopLinkData>;
export type UpdateProductPayload = Partial<ProductPayload>;

// ===================================
// TIPE DATA - ARTICLES
// ===================================
export interface Article {
  id_artikel: number;
  judul: string;
  deskripsi_singkat: string;
  isi_lengkap: string;
  gambar: string;
  tbl_user: {
    nama_user: string;
    email: string;
  };
}

export interface CreateArticleData {
  judul: string;
  isi_lengkap: string;
  id_user: number;
  deskripsi_singkat?: string;
  gambar?: string;
}

export type UpdateArticleData = Partial<Omit<CreateArticleData, 'id_user'>>;
