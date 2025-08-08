# Backend - Belanja Aja

API backend dan server untuk aplikasi e-commerce.

## Fitur
- RESTful API
- Autentikasi dan autorisasi
- Manajemen produk
- Manajemen pesanan
- Payment gateway integration
- Notifikasi

## Teknologi
- Node.js dengan Express.js
- Database: MySQL/PostgreSQL
- JWT untuk authentication
- Middleware untuk CORS dan security

## Struktur
```
backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── config/
└── tests/
```

## API Endpoints
- `/api/auth` - Authentication
- `/api/products` - Produk management
- `/api/orders` - Order management
- `/api/users` - User management
