# API Documentation - Ekraf Admin

## Overview
This document provides a comprehensive overview of all APIs used in the Ekraf Admin application, their endpoints, and usage patterns.

## Base URLs
- **Development:** `http://localhost:4097`
- **Production:** `https://ekraf.asepharyana.tech`
- **File Upload:** `https://apidl.asepharyana.cloud/api/uploader/ryzencdn`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Clients

### 1. Authentication API (`authApi`)
**Base Path:** `/api/auth`

#### Endpoints:
- `POST /auth/login/{level}` - Login with user level (superadmin, admin, umkm)
- `POST /auth/register/umkm` - Register new UMKM user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/verify-email` - Verify email address

#### Usage Examples:
```typescript
// Login
const response = await authApi.login({u: 'username', p: 'password'}, 'admin');

// Register
const registerData: RegistrationData = {
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  password: 'password123',
  gender: 'Laki-laki',
  phone_number: '081234567890',
  business_name: 'My Business',
  business_status: 'BARU',
  business_category_id: 1
};
await authApi.register(registerData);

// Forgot password
await authApi.forgotPassword({email: 'john@example.com'});
```

### 2. Products API (`productsApi`)
**Base Path:** `/api/products`

#### Endpoints:
- `GET /products` - Get all products with filters
- `GET /products/{id}` - Get product by ID
- `POST /products` - Create new product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product
- `POST /products/{id}/links` - Add online store link
- `PUT /products/{id}/links/{linkId}` - Update online store link

#### Usage Examples:
```typescript
// Get all products with filters
const products = await productsApi.getAll({
  page: 1,
  limit: 10,
  q: 'search term',
  kategori: 1,
  subsector: 1
});

// Create product
const productData: ProductPayload = {
  name: 'Product Name',
  description: 'Product description',
  price: 100000,
  stock: 10,
  phone_number: '081234567890',
  business_category_id: 1,
  image: 'https://example.com/image.jpg'
};
await productsApi.create(productData);

// Add online store link
await productsApi.createLink(productId, {
  platform_name: 'Shopee',
  url: 'https://shopee.co.id/product/123'
});
```

### 3. Users API (`usersApi`)
**Base Path:** `/api/users`

#### Endpoints:
- `GET /users` - Get all users (admin only)
- `GET /users/profile` - Get current user profile
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `GET /users/{id}/products` - Get user's products
- `GET /users/{id}/articles` - Get user's articles

#### Usage Examples:
```typescript
// Get current user profile
const profile = await usersApi.getOwnProfile();

// Get all users (admin only)
const users = await usersApi.getAll();

// Get user products
const userProducts = await usersApi.getProducts(userId);
```

### 4. Articles API (`articlesApi`)
**Base Path:** `/api/articles`

#### Endpoints:
- `GET /articles` - Get all articles
- `GET /articles/{id}` - Get article by ID
- `POST /articles` - Create new article
- `PUT /articles/{id}` - Update article
- `DELETE /articles/{id}` - Delete article

#### Usage Examples:
```typescript
// Create article
const articleData: CreateArticleData = {
  title: 'Article Title',
  content: 'Article content...',
  artikel_kategori_id: '1',
  thumbnail: 'https://example.com/thumbnail.jpg',
  is_featured: false
};
await articlesApi.create(articleData);
```

### 5. Business Categories API (`businessCategoriesApi`)
**Base Path:** `/api/business-categories`

#### Endpoints:
- `GET /business-categories` - Get all business categories
- `GET /business-categories/{id}` - Get business category by ID
- `POST /business-categories` - Create new business category
- `PUT /business-categories/{id}` - Update business category
- `DELETE /business-categories/{id}` - Delete business category

#### Usage Examples:
```typescript
// Get all business categories
const categories = await businessCategoriesApi.getAll();

// Create business category
const categoryData = {
  name: 'Category Name',
  image: 'https://example.com/image.jpg',
  sub_sector_id: '1',
  description: 'Category description'
};
await businessCategoriesApi.create(categoryData);
```

### 6. Subsectors API (`subsectorsApi`)
**Base Path:** `/api/subsectors`

#### Endpoints:
- `GET /subsectors` - Get all subsectors
- `GET /subsectors/{id}` - Get subsector by ID
- `POST /subsectors` - Create new subsector
- `PUT /subsectors/{id}` - Update subsector
- `DELETE /subsectors/{id}` - Delete subsector

#### Usage Examples:
```typescript
// Get all subsectors
const subsectors = await subsectorsApi.getAll();

// Create subsector
await subsectorsApi.create({title: 'Subsector Title'});
```

### 7. Master Data API (`masterDataApi`)
**Base Path:** `/api/master-data`

#### Endpoints:
- `GET /master-data/business-categories` - Get business categories
- `GET /master-data/levels` - Get user levels
- `GET /master-data/subsectors` - Get subsectors

#### Usage Examples:
```typescript
// Get business categories
const categories = await masterDataApi.getBusinessCategories();

// Get user levels
const levels = await masterDataApi.getUserLevels();
```

### 8. File Upload API (`uploaderApi`)
**Base URL:** `https://apidl.asepharyana.cloud/api/uploader/ryzencdn`

#### Usage Example:
```typescript
import {launchImageLibrary} from 'react-native-image-picker';

// Select and upload image
launchImageLibrary({mediaType: 'photo'}, async (response) => {
  if (response.assets && response.assets[0]) {
    const imageUrl = await uploaderApi.uploadImage(response.assets[0]);
    // Use imageUrl in your data
  }
});
```

## Component Usage Patterns

### Dashboard Components
All dashboard components follow similar patterns:

```typescript
// ManajemenProduk.tsx
const fetchProducts = useCallback(async (currentPage: number, isRefresh: boolean) => {
  try {
    const response = await productsApi.getAll({ 
      page: currentPage, 
      limit: 10, 
      q: searchQuery 
    });
    setProducts(response.data);
    setTotalPages(response.totalPages);
  } catch (e: any) {
    setError(e.message);
  }
}, [searchQuery]);

// ManajemenMitra.tsx
const fetchMitra = useCallback(async () => {
  try {
    const baseUsers = await usersApi.getAll();
    // Process users...
  } catch (e: any) {
    setError(e.message);
  }
}, []);
```

### Form Components
Form components use APIs for data submission:

```typescript
// FormProdukScreen.tsx
const handleSubmit = async () => {
  try {
    let imageUrl = existingProduct?.image || '';
    
    if (imageAsset) {
      imageUrl = await uploaderApi.uploadImage(imageAsset);
    }
    
    const finalPayload: ProductPayload = {
      ...formData,
      image: imageUrl,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      business_category_id: parseInt(formData.business_category_id, 10)
    };
    
    if (existingProduct) {
      await productsApi.update(existingProduct.id, finalPayload);
    } else {
      await productsApi.create(finalPayload);
    }
    
    navigation.goBack();
  } catch (e: any) {
    Alert.alert('Error', e.message);
  }
};
```

## Error Handling

All APIs use consistent error handling through the `handleError` function:

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

## Common Response Types

All API responses follow these patterns:

```typescript
// Single data response
interface ApiResponse<T> {
  message: string;
  data: T;
  success?: boolean;
}

// Paginated response
interface PaginatedApiResponse<T> {
  message: string;
  totalPages: number;
  currentPage: number;
  data: T;
}

// Message only response
interface ApiMessageResponse {
  message: string;
  success?: boolean;
}
```

## Security

- All protected endpoints require JWT authentication
- Tokens are stored in AsyncStorage
- Automatic token injection via Axios interceptors
- User levels control access to different endpoints (1=SuperAdmin, 2=Admin, 3=UMKM)

## File Structure

```
lib/
├── api.ts          # All API client implementations
├── types.ts        # TypeScript type definitions
└── 

app/
├── Auth/           # Authentication screens
├── DashboardScreen/ # Admin dashboard screens
├── Forms/          # Form components
└── Context/        # React contexts
```

This documentation provides a complete overview of all APIs used in the Ekraf Admin application, their endpoints, usage patterns, and integration with React Native components.
