// lib/types.ts

// ===================================
// TIPE DATA - GENERIC & PAGINASI
// ===================================

// Define common types
export type BusinessStatus = 'BARU' | 'SUDAH_LAMA';
export type Gender = 'Laki-laki' | 'Perempuan';

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
  id: string; // BigInt as string in OpenAPI
  name: string;
  email: string;
  email_verified_at?: string | null;
  username?: string | null;
  gender?: Gender | null;
  phone_number?: string | null;
  image?: string | null;
  business_name?: string | null;
  business_status?: BusinessStatus | null;
  level_id: string; // Changed to string to match OpenAPI
  business_category_id?: number | null;
  two_factor_enabled?: boolean;
  verifiedAt?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  // Relations
  levels?: Level;
  business_categories?: BusinessCategory | null;
  level?: string;
  productCount?: number;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegistrationData {
  name: string;
  username: string;
  email: string;
  password: string;
  gender: Gender;
  phone_number: string;
  business_name?: string;
  business_status?: BusinessStatus;
  business_category_id?: number; // Changed from string to number
}

export interface RegisterResponse {
  message: string;
  user: TemporaryUser; // Changed from success boolean to user object
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
  user: User;
}


// ===================================
// TIPE DATA - MASTER DATA & KATEGORI
// ===================================
export interface BusinessCategory {
  id: number;
  name: string;
  image?: string | null;
  sub_sector_id?: string; // Added from OpenAPI
  description?: string | null; // Added from OpenAPI
  created_at?: string | null;
  updated_at?: string | null;
  sub_sectors?: SubSector; // Added relation
}

export interface KategoriUsaha {
  id: number;
  name: string;
  image?: string | null;
  sub_sector_id?: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Tipe data payload untuk membuat atau memperbarui Kategori Usaha.
 */
export interface KategoriUsahaPayload {
  name: string;
  image?: string; // URL dari gambar yang sudah di-upload
  sub_sector_id: string; // Required field as per OpenAPI specification
}

export interface Level {
  id: string; // Changed to string to match OpenAPI
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Subsector {
  id: string; // Changed to string to match OpenAPI
  title: string;
  slug: string;
  image?: string | null; // Added from OpenAPI
  description?: string | null; // Added from OpenAPI
  created_at?: string | null;
  updated_at?: string | null;
}

// Add SubSector alias for consistency
export type SubSector = Subsector;


// ===================================
// TIPE DATA - PRODUCTS
// ===================================

// Define product status types
export type ProductStatus = 'disetujui' | 'pending' | 'ditolak' | 'tidak_aktif';

export interface Product {
  id: number;
  name: string;
  owner_name?: string | null;
  description: string;
  price: number;
  stock: number;
  image: string;
  phone_number: string;
  status?: ProductStatus;
  status_produk?: ProductStatus;
  uploaded_at?: string;
  user_id?: string | null; // Changed to string to match OpenAPI
  business_category_id?: number | null;
  sub_sector_id?: string | null; // Added from OpenAPI
  created_at?: string | null;
  updated_at?: string | null;
  // Relations
  business_categories?: BusinessCategory | null;
  users?: User | null;
  sub_sectors?: SubSector | null; // Added relation
  online_store_links?: OnlineStoreLink[]; // Renamed from TblOlshopLink
}

export interface ProductPayload {
  name: string;
  owner_name?: string;
  description: string;
  price: number;
  stock: number;
  phone_number: string;
  business_category_id: number;
  sub_sector_id?: string; // Added from OpenAPI
  image: string;
  status_produk?: ProductStatus;
  status?: ProductStatus; // Add status field sesuai database
}

export interface OnlineStoreLink {
  id: number;
  product_id: number;
  platform_name?: string | null;
  url: string;
}

export interface CreateOnlineStoreLinkData {
  platform_name?: string;
  url: string;
}

export type UpdateOnlineStoreLinkData = Partial<CreateOnlineStoreLinkData>;
export type UpdateProductPayload = Partial<ProductPayload>;

// Legacy interface for backward compatibility
export interface TblOlshopLink {
  id: number;
  product_id: number;
  platform_name?: string | null;
  url: string;
}

export interface CreateOlshopLinkData {
  platform_name: string;
  url: string;
}

export type UpdateOlshopLinkData = Partial<CreateOlshopLinkData>;

// ===================================
// TIPE DATA - ARTICLES
// ===================================
export interface Article {
  id: number;
  author_id: string; // Changed to string to match OpenAPI
  artikel_kategori_id: string; // Changed to string to match OpenAPI
  title: string;
  slug: string;
  thumbnail: string;
  content: string;
  is_featured?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  // Relations
  users?: User;
  author?: {
    name: string;
    email: string;
  };
}

export interface CreateArticleData {
  title: string;
  content: string;
  artikel_kategori_id: string; // Changed to string to match OpenAPI
  thumbnail: string;
  is_featured?: boolean;
}

export type UpdateArticleData = Partial<Omit<CreateArticleData, 'author_id'>>;

// ===================================
// TIPE DATA - TEMPORARY USER
// ===================================
export interface TemporaryUser {
  id: number;
  name: string;
  username: string;
  email: string;
  gender: Gender;
  phone_number?: string | null;
  business_name?: string | null;
  business_status?: BusinessStatus | null;
  level_id: string; // Changed to string to match OpenAPI
  business_category_id?: number | null;
  verificationToken: string;
  verificationTokenExpiry?: string | null;
  createdAt: string;
  // Relations
  levels?: Level;
  business_categories?: BusinessCategory | null;
}

// ===================================
// TIPE DATA - LOGIN REQUEST & RESPONSE
// ===================================
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginSuccessResponse {
  message: string;
  token: string;
  user: User;
}

// ===================================
// TIPE DATA - ERROR RESPONSE
// ===================================
export interface ErrorResponse {
  message: string;
}

// ===================================
// TIPE DATA - PROTECTED DATA
// ===================================
export interface InfoPenggunaProtected {
  id: number;
  username: string;
  level: number;
  email?: string | null;
}

export interface DataContoh {
  id: number;
  deskripsi: string;
}

export interface ProtectedDataResponse {
  message: string;
  infoPengguna: InfoPenggunaProtected;
  dataContohLain: DataContoh[];
}

// ===================================
// TIPE DATA - ADDITIONAL RESPONSES & LISTS
// ===================================

export interface UserProfile {
  id: string;
  name: string;
  username?: string | null;
  email: string;
  gender?: Gender | null;
  phone_number?: string | null;
  image?: string | null;
  business_name?: string | null;
  business_status?: BusinessStatus | null;
  level_id: string;
  business_category_id?: number | null;
  levels?: Level;
  business_categories?: BusinessCategory | null;
}

export interface UserListResponse {
  users: User[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: Product[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ArticleListResponse {
  articles: Article[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface BusinessCategoryListResponse {
  business_categories: BusinessCategory[];
  total?: number;
}

export interface SubSectorListResponse {
  sub_sectors: SubSector[];
  total?: number;
}

export interface LevelListResponse {
  levels: Level[];
  total?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface MasterDataResponse {
  business_categories: BusinessCategory[];
  levels: Level[];
  sub_sectors: SubSector[];
}

export interface StatisticsResponse {
  total_users: number;
  total_products: number;
  total_articles: number;
  total_umkm: number;
  total_admin: number;
  total_superadmin: number;
  products_by_status?: {
    disetujui: number;
    pending: number;
    ditolak: number;
    tidak_aktif: number;
  };
}

// ===================================
// TIPE DATA - VALIDATION & ERRORS
// ===================================

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface UnauthorizedError {
  message: string;
  error: string;
  statusCode: number;
}

export interface ForbiddenError {
  message: string;
  error: string;
  statusCode: number;
}

export interface NotFoundError {
  message: string;
  error: string;
  statusCode: number;
}

// ===================================
// TIPE DATA - BACKWARD COMPATIBILITY ALIASES
// ===================================
// Untuk menjaga kompatibilitas dengan kode yang sudah ada
export type TblLevel = Level;
export type Subsektor = Subsector;

// Legacy field mappings untuk migrasi bertahap
export interface UserLegacy {
  id_user: number;
  nama_user: string;
  jk: Gender;
  nohp: string;
  nama_usaha?: string;
  status_usaha?: BusinessStatus;
  id_level: number;
  id_kategori_usaha?: number;
}

export interface ProductLegacy {
  id_produk: number;
  nama_produk: string;
  nama_pelaku: string;
  deskripsi: string;
  harga: number;
  stok: number;
  nohp: string;
  gambar: string;
  id_kategori_usaha: number;
  id_user: number;
}
