# API Usage Summary - Ekraf Admin

## All API Endpoints and Their Usage

### Authentication APIs
**Used in:** `app/Auth/Login.tsx`, `app/Auth/ResetPassword.tsx`

```typescript
// Login
await authApi.login({u: 'username', p: 'password'}, 'admin');

// Forgot Password
await authApi.forgotPassword({email: 'user@example.com'});
```

### Products APIs
**Used in:** `app/DashboardScreen/ManajemenProduk.tsx`, `app/Forms/FormProdukScreen.tsx`, `app/DashboardScreen/Dashboard.tsx`

```typescript
// Get all products with pagination and search
await productsApi.getAll({page: 1, limit: 10, q: 'search'});

// Create product
await productsApi.create(productData);

// Update product
await productsApi.update(productId, updatedData);

// Delete product
await productsApi.delete(productId);

// Update product status
await productsApi.update(productId, {status_produk: 'disetujui'});
```

### Users APIs
**Used in:** `app/DashboardScreen/ManajemenMitra.tsx`, `app/DashboardScreen/Dashboard.tsx`

```typescript
// Get all users
await usersApi.getAll();

// Get user products
await usersApi.getProducts(userId);

// Get user profile
await usersApi.getOwnProfile();
```

### Master Data APIs
**Used in:** `app/DashboardScreen/Dashboard.tsx`, `app/Forms/FormProdukScreen.tsx`, `app/DashboardScreen/ManajemenKategoriUsaha.tsx`

```typescript
// Get business categories
await masterDataApi.getBusinessCategories();

// Get user levels
await masterDataApi.getUserLevels();

// Get subsectors
await masterDataApi.getSubsectors();
```

### Business Categories APIs
**Used in:** `app/DashboardScreen/ManajemenKategoriUsaha.tsx`

```typescript
// Get all categories
await masterDataApi.getBusinessCategories();

// Create category
await kategoriUsahaApi.create(categoryData);

// Update category
await kategoriUsahaApi.update(categoryId, updatedData);

// Delete category
await kategoriUsahaApi.delete(categoryId);
```

### File Upload APIs
**Used in:** `app/Forms/FormProdukScreen.tsx`, `app/DashboardScreen/ManajemenKategoriUsaha.tsx`

```typescript
// Upload image
const imageUrl = await uploaderApi.uploadImage(imageAsset);
```

## Component-wise API Usage

### Dashboard.tsx
- `usersApi.getAll()` - Get all users for statistics
- `productsApi.getAll({limit: 10})` - Get recent products
- `masterDataApi.getBusinessCategories()` - Get categories count

### ManajemenProduk.tsx
- `productsApi.getAll({page, limit, q})` - Get products with pagination/search
- `productsApi.update(id, {status_produk})` - Update product status
- `productsApi.delete(id)` - Delete product

### ManajemenMitra.tsx
- `usersApi.getAll()` - Get all users
- `usersApi.getProducts(userId)` - Get products for each user

### ManajemenKategoriUsaha.tsx
- `masterDataApi.getBusinessCategories()` - Get categories
- `kategoriUsahaApi.create(data)` - Create new category
- `kategoriUsahaApi.update(id, data)` - Update category
- `kategoriUsahaApi.delete(id)` - Delete category
- `uploaderApi.uploadImage(asset)` - Upload category image

### FormProdukScreen.tsx
- `masterDataApi.getBusinessCategories()` - Get categories for dropdown
- `uploaderApi.uploadImage(asset)` - Upload product image
- `productsApi.create(data)` - Create new product
- `productsApi.update(id, data)` - Update existing product

### Login.tsx
- `authApi.login({u, p}, level)` - User authentication

### ResetPassword.tsx
- `authApi.forgotPassword({email})` - Request password reset

## API Client Structure

All API clients are defined in `lib/api.ts` and follow this pattern:

```typescript
export const apiName = {
  method: (params) => 
    client
      .httpMethod<ResponseType>(endpoint, data)
      .then(res => res.data)
      .catch(e => handleError(e, 'context')),
};
```

## Error Handling Pattern

All APIs use consistent error handling:

```typescript
const handleError = (error: any, context: string): never => {
  console.error(`API Error in ${context}:`, JSON.stringify(error, null, 2));
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    }
    throw new Error(error.response.data.message ?? `Gagal ${context}.`);
  }
  throw new Error(`Terjadi kesalahan tidak terduga saat ${context}.`);
};
```

## Authentication Flow

1. User logs in via `authApi.login()`
2. JWT token is stored in AsyncStorage
3. Token is automatically added to all private API calls via Axios interceptor
4. User data is stored in AsyncStorage for app state

## File Upload Flow

1. User selects image using `react-native-image-picker`
2. Image is uploaded to external service via `uploaderApi.uploadImage()`
3. Returned URL is used in product/category data
4. Data is saved via respective API endpoints

## Current API Endpoints (OpenAPI Spec)

### Authentication
- `POST /api/auth/login/{level}` - Login
- `POST /api/auth/register/umkm` - Register UMKM
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - Get products (with filters)
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `POST /api/products/{id}/links` - Add store link
- `PUT /api/products/{id}/links/{linkId}` - Update store link

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/users/{id}/products` - Get user products
- `GET /api/users/{id}/articles` - Get user articles

### Business Categories
- `GET /api/business-categories` - Get all categories
- `GET /api/business-categories/{id}` - Get category by ID
- `POST /api/business-categories` - Create category
- `PUT /api/business-categories/{id}` - Update category
- `DELETE /api/business-categories/{id}` - Delete category

### Master Data
- `GET /api/master-data/business-categories` - Get business categories
- `GET /api/master-data/levels` - Get user levels
- `GET /api/master-data/subsectors` - Get subsectors

### Articles
- `GET /api/articles` - Get all articles
- `GET /api/articles/{id}` - Get article by ID
- `POST /api/articles` - Create article
- `PUT /api/articles/{id}` - Update article
- `DELETE /api/articles/{id}` - Delete article

### Subsectors
- `GET /api/subsectors` - Get all subsectors
- `GET /api/subsectors/{id}` - Get subsector by ID
- `POST /api/subsectors` - Create subsector
- `PUT /api/subsectors/{id}` - Update subsector
- `DELETE /api/subsectors/{id}` - Delete subsector

## Type Definitions

All API types are defined in `lib/types.ts` and match the OpenAPI specification:

- User-related types: `User`, `UserProfile`, `RegistrationData`
- Product-related types: `Product`, `ProductPayload`, `OnlineStoreLink`
- Category-related types: `BusinessCategory`, `KategoriUsaha`
- Response types: `ApiResponse<T>`, `PaginatedApiResponse<T>`, `ApiMessageResponse`
- Error types: `ErrorResponse`, `ValidationError`

This comprehensive overview shows all API usage patterns in the Ekraf Admin application.
