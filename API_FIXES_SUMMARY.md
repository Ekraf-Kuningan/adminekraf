# Perubahan API Client untuk Sesuai dengan OpenAPI Spec

## ✅ Perubahan yang Telah Dilakukan

### 1. **Response Type Standardization**
Semua API client sekarang menggunakan response type yang konsisten dengan OpenAPI spec:

```typescript
// Sebelum (menggunakan generic types)
.get<T.ApiResponse<T.Product>>('/products')

// Sesudah (sesuai OpenAPI spec)
.get<{message: string; data: T.Product}>('/products')
```

### 2. **Products API (`/api/products`)**
- ✅ Response type diubah ke format OpenAPI
- ✅ Parameter filter tetap sama (`page`, `limit`, `q`, `kategori`, `subsector`)
- ✅ Online store links menggunakan endpoint yang benar

### 3. **Users API (`/api/users`)**
- ✅ ID parameter diubah dari `number` ke `string` sesuai OpenAPI
- ✅ Profile endpoint menggunakan `UserProfile` type
- ✅ Response format disesuaikan

### 4. **Articles API (`/api/articles`)**
- ✅ Menambahkan method `getAll()` yang hilang
- ✅ Response format disesuaikan
- ✅ ID masih menggunakan `number` sesuai OpenAPI

### 5. **Business Categories API (`/api/business-categories`)**
- ✅ Endpoint sesuai dengan OpenAPI (`/business-categories`, bukan `/kategori-usaha`)
- ✅ Response format disesuaikan
- ✅ Create/update menggunakan field yang benar (`sub_sector_id`, `description`)

### 6. **Subsectors API (`/api/subsectors`)**
- ✅ ID menggunakan `string` sesuai OpenAPI
- ✅ Response format disesuaikan
- ✅ Endpoint dan method sesuai spec

### 7. **Master Data API (`/api/master-data`)**
- ✅ Response format disesuaikan
- ✅ Endpoint tetap sama sesuai OpenAPI

### 8. **Legacy Compatibility**
- ✅ `kategoriUsahaApi` tetap ada untuk backward compatibility
- ✅ Sekarang menggunakan endpoint `/business-categories` yang benar
- ✅ Response format disesuaikan

## 🔄 Mapping Endpoint Lengkap

### Authentication
```typescript
POST /api/auth/login/{level}         → authApi.login()
POST /api/auth/register/umkm         → authApi.register()
POST /api/auth/forgot-password       → authApi.forgotPassword()
POST /api/auth/reset-password        → authApi.resetPassword()
POST /api/auth/verify-email          → authApi.verifyEmail()
```

### Products
```typescript
GET    /api/products                 → productsApi.getAll()
GET    /api/products/{id}            → productsApi.getById()
POST   /api/products                 → productsApi.create()
PUT    /api/products/{id}            → productsApi.update()
DELETE /api/products/{id}            → productsApi.delete()
POST   /api/products/{id}/links      → productsApi.createLink()
PUT    /api/products/{id}/links/{linkId} → productsApi.updateLink()
```

### Users
```typescript
GET    /api/users                    → usersApi.getAll()
GET    /api/users/profile            → usersApi.getOwnProfile()
GET    /api/users/{id}               → usersApi.getById()
PUT    /api/users/{id}               → usersApi.update()
DELETE /api/users/{id}               → usersApi.delete()
GET    /api/users/{id}/products      → usersApi.getProducts()
GET    /api/users/{id}/articles      → usersApi.getArticles()
```

### Articles
```typescript
GET    /api/articles                 → articlesApi.getAll()
GET    /api/articles/{id}            → articlesApi.getById()
POST   /api/articles                 → articlesApi.create()
PUT    /api/articles/{id}            → articlesApi.update()
DELETE /api/articles/{id}            → articlesApi.delete()
```

### Business Categories
```typescript
GET    /api/business-categories      → businessCategoriesApi.getAll()
GET    /api/business-categories/{id} → businessCategoriesApi.getById()
POST   /api/business-categories      → businessCategoriesApi.create()
PUT    /api/business-categories/{id} → businessCategoriesApi.update()
DELETE /api/business-categories/{id} → businessCategoriesApi.delete()
```

### Subsectors
```typescript
GET    /api/subsectors               → subsectorsApi.getAll()
GET    /api/subsectors/{id}          → subsectorsApi.getById()
POST   /api/subsectors               → subsectorsApi.create()
PUT    /api/subsectors/{id}          → subsectorsApi.update()
DELETE /api/subsectors/{id}          → subsectorsApi.delete()
```

### Master Data
```typescript
GET    /api/master-data/business-categories → masterDataApi.getBusinessCategories()
GET    /api/master-data/levels              → masterDataApi.getUserLevels()
GET    /api/master-data/subsectors          → masterDataApi.getSubsectors()
```

## 🔧 Type Changes Summary

### ID Types
- **User ID**: `number` → `string` ✅
- **Product ID**: `number` (tetap)
- **Article ID**: `number` (tetap)
- **Business Category ID**: `number` (tetap)
- **Subsector ID**: `number` → `string` ✅

### Response Format
Semua response sekarang menggunakan format:
```typescript
{
  message: string;
  data?: T; // untuk single data
  // atau untuk paginated:
  totalPages?: number;
  currentPage?: number;
  data: T[];
}
```

## 🧪 Testing Required

Setelah perubahan ini, perlu dilakukan testing pada:

1. **Login flow** - memastikan authentication masih bekerja
2. **Product management** - create, read, update, delete products
3. **User management** - dengan ID yang sekarang string
4. **Category management** - dengan endpoint baru `/business-categories`
5. **File upload** - memastikan masih bekerja dengan produk/kategori

## ✅ Status

Semua API client sudah diperbarui untuk sesuai dengan OpenAPI 3.0.0 specification. Response types sudah diperbaiki dan endpoint sudah benar. Komponen React Native seharusnya masih kompatibel karena interface types sudah diperbarui sebelumnya.
