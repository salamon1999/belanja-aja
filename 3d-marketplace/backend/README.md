# 3D Marketplace Backend - Sistem Login dan Database

Backend API server untuk sistem authentication dan database user management.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 atau lebih tinggi)
- npm atau yarn

### 1. Install Dependencies

Masuk ke folder backend dan install dependencies:
```bash
cd backend
npm install
```

### 2. Jalankan Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:3001`

## 📝 Demo Accounts

Gunakan akun berikut untuk testing:

| Username | Password | Role | Avatar |
|----------|----------|------|---------|
| `admin` | `admin123` | admin | 👨‍💼 |
| `johndoe` | `john123` | customer | 👨 |
| `sarah` | `sarah123` | customer | 👩 |
| `demo` | `demo123` | customer | 🧪 |

## 🔗 API Endpoints

### Authentication
- `POST /api/login` - Login user
- `POST /api/register` - Register new user  
- `POST /api/logout` - Logout user

### User Management
- `GET /api/profile` - Get user profile (requires auth)
- `PUT /api/profile` - Update user profile (requires auth)
- `POST /api/change-password` - Change password (requires auth)

### Admin Only
- `GET /api/admin/users` - Get all users (admin only)

### Health Check
- `GET /api/health` - Check server status

## 📊 Database Structure

### User Schema
```json
{
  "id": "number",
  "username": "string",
  "email": "string", 
  "password": "string (hashed)",
  "fullName": "string",
  "role": "admin|customer",
  "avatar": "emoji string",
  "createdAt": "ISO date",
  "lastLogin": "ISO date",
  "isActive": "boolean",
  "preferences": {
    "theme": "dark|light",
    "language": "id|en", 
    "notifications": "boolean"
  },
  "address": {
    "street": "string",
    "city": "string",
    "state": "string", 
    "zipCode": "string",
    "country": "string"
  },
  "phone": "string"
}
```

## 🔐 Security Features

- **JWT Authentication** - Token-based authentication
- **Password Hashing** - bcrypt untuk hashing password
- **Rate Limiting** - Mencegah brute force attack
- **Input Validation** - Validasi semua input user
- **Session Management** - Tracking user sessions

## 📁 File Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies dan scripts
└── README.md          # Dokumentasi ini

../database/
└── users.json         # Database JSON (file-based)
```

## ⚙️ Configuration

### Environment Variables
Buat file `.env` untuk konfigurasi:
```env
PORT=3001
JWT_SECRET=your-super-secret-key-here-2024
NODE_ENV=development
```

### Database Configuration
Database menggunakan file JSON (`../database/users.json`). Dalam production, disarankan menggunakan database yang lebih robust seperti PostgreSQL atau MongoDB.

## 🔧 Development

### Install Development Dependencies
```bash
npm install --save-dev nodemon
```

### Scripts Available
```bash
npm start          # Jalankan server production
npm run dev        # Jalankan server development dengan auto-reload
```

### API Testing dengan cURL

**Login:**
```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

**Get Profile (with token):**
```bash
curl -X GET http://localhost:3001/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Register:**
```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com", 
    "password":"password123",
    "fullName":"Test User"
  }'
```

## 🚨 Error Handling

Server mengembalikan error dalam format JSON:
```json
{
  "error": "Pesan error dalam bahasa Indonesia",
  "code": "ERROR_CODE" // (opsional)
}
```

### Common Error Codes
- `400` - Bad Request (input tidak valid)
- `401` - Unauthorized (tidak login atau token tidak valid)
- `403` - Forbidden (tidak memiliki akses)
- `404` - Not Found (endpoint atau user tidak ditemukan)
- `409` - Conflict (username/email sudah digunakan)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## 📈 Monitoring

### Health Check
Akses `http://localhost:3001/api/health` untuk cek status server:
```json
{
  "status": "OK",
  "message": "3D Marketplace API is running", 
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Logs
Server akan menampilkan logs untuk:
- Request masuk
- Error yang terjadi  
- Login attempts
- Database operations

## 🔄 Database Migration

Untuk upgrade database schema di masa depan, buat file migration di folder `migrations/`.

### Backup Database
```bash
cp database/users.json database/users_backup_$(date +%Y%m%d_%H%M%S).json
```

## 🚀 Production Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name "3d-marketplace-api"
pm2 save
pm2 startup
```

### Using Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Setup
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Setup proper logging
- Configure reverse proxy (nginx)
- Setup SSL certificate

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes  
4. Create Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail.

---

**Happy Coding! 🚀**

*Backend API untuk 3D Marketplace dengan sistem authentication yang aman dan scalable*
