# 🔐 3D Marketplace - Database Login System

Dokumentasi lengkap sistem database dan authentication untuk website 3D Marketplace.

## 🎯 Overview

Sistem ini menyediakan:
- ✅ **Database User Management** - Penyimpanan data user dengan JSON file
- ✅ **Authentication System** - Login/register dengan JWT tokens
- ✅ **Security Features** - Password hashing, rate limiting, session management
- ✅ **Frontend Integration** - Halaman login/register dengan 3D background
- ✅ **Demo Accounts** - 4 akun demo untuk testing

## 📁 Struktur File Database

```
3d-marketplace/
├── 📄 index.html                 # Website utama
├── 🔐 login.html                 # Halaman login/register
├── 📝 setup.sh                   # Script setup otomatis
├── 🎨 css/
│   ├── style.css                 # CSS utama
│   └── auth.css                  # CSS khusus authentication
├── 💻 js/
│   ├── script.js                 # JavaScript utama (updated)
│   └── auth.js                   # JavaScript authentication
├── 🗄️ database/
│   └── users.json                # Database JSON users
└── 🖥️ backend/
    ├── server.js                 # Backend API server
    ├── package.json              # Dependencies backend
    └── README.md                 # Dokumentasi backend
```

## 🚀 Quick Start Guide

### 1. Setup Otomatis
```bash
cd 3d-marketplace
./setup.sh
```

### 2. Setup Manual

**Install Backend Dependencies:**
```bash
cd backend
npm install
```

**Start Backend Server:**
```bash
npm start
# atau untuk development:
npm run dev
```

### 3. Akses Website
- **Frontend**: Buka `index.html` di browser
- **Login Page**: Buka `login.html` di browser  
- **Backend API**: `http://localhost:3001`

## 👥 Demo Accounts

| Username | Password | Role | Avatar | Description |
|----------|----------|------|---------|-------------|
| `admin` | `admin123` | admin | 👨‍💼 | Administrator dengan akses penuh |
| `johndoe` | `john123` | customer | 👨 | User biasa |
| `sarah` | `sarah123` | customer | 👩 | User biasa |
| `demo` | `demo123` | customer | 🧪 | Akun demo untuk testing |

## 🗄️ Database Schema

### User Data Structure
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@3dmarket.com",
  "password": "$2b$10$hashedPassword...",
  "fullName": "Administrator",
  "role": "admin|customer",
  "avatar": "👨‍💼",
  "createdAt": "2024-01-01T00:00:00Z",
  "lastLogin": "2024-01-15T10:30:00Z",
  "isActive": true,
  "preferences": {
    "theme": "dark",
    "language": "id",
    "notifications": true
  },
  "address": {
    "street": "Jl. Admin No. 1",
    "city": "Jakarta",
    "state": "DKI Jakarta",
    "zipCode": "12345",
    "country": "Indonesia"
  },
  "phone": "+62-21-1234-5678"
}
```

### Database File: `database/users.json`
```json
{
  "users": [array_of_users],
  "sessions": [active_sessions],
  "loginAttempts": {rate_limiting_data},
  "settings": {system_settings}
}
```

## 🔐 Authentication Flow

### 1. Login Process
```
User Input → Frontend Validation → API Request → Backend Validation → JWT Token → Success
```

### 2. Registration Process  
```
User Input → Validation → Check Existing User → Hash Password → Create User → Success
```

### 3. Authenticated Requests
```
Frontend → Add JWT Header → Backend Verify → API Response
```

## 🎨 Frontend Features

### Halaman Login (`login.html`)
- ✅ **3D Animated Background** - Particle system dengan Three.js
- ✅ **Dual Form** - Login dan Register dalam satu halaman
- ✅ **Demo Account Buttons** - Quick fill untuk testing
- ✅ **Password Validation** - Real-time validation requirements
- ✅ **Form Animations** - Smooth transitions dan loading states
- ✅ **Error/Success Modals** - User feedback yang jelas

### Integrasi Website Utama (`index.html`)
- ✅ **Auth-Protected Cart** - Harus login untuk add to cart
- ✅ **User Menu Dropdown** - Profile, settings, logout
- ✅ **Dynamic UI** - Berubah berdasarkan login status
- ✅ **Session Management** - Auto-logout setelah 24 jam

## 🖥️ Backend API

### Authentication Endpoints

**POST `/api/login`**
```javascript
// Request
{
  "username": "demo",
  "password": "demo123"
}

// Response
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 4,
    "username": "demo",
    "fullName": "Demo User",
    "role": "customer",
    "avatar": "🧪"
  }
}
```

**POST `/api/register`**
```javascript
// Request  
{
  "username": "newuser",
  "email": "user@email.com",
  "password": "password123",
  "fullName": "New User"
}

// Response
{
  "success": true,
  "user": {
    "id": 5,
    "username": "newuser",
    "email": "user@email.com",
    "fullName": "New User",
    "role": "customer"
  }
}
```

**GET `/api/profile`** (Requires Auth)
```javascript
// Headers
Authorization: Bearer jwt_token

// Response
{
  "success": true,
  "user": {full_user_profile}
}
```

## 🔧 Development Mode vs Production

### Development (Demo Mode)
- ✅ Frontend berjalan standalone (tanpa backend)
- ✅ Simulasi API calls dengan localStorage
- ✅ Demo accounts work out of the box
- ✅ No server setup required

### Production Mode  
- ✅ Full backend API server
- ✅ Real JWT authentication
- ✅ Database persistence
- ✅ Rate limiting & security features

## 🔒 Security Features

### 1. Password Security
- **bcrypt hashing** - Industry standard password hashing
- **Salt rounds: 10** - Secure against rainbow table attacks
- **Minimum 8 characters** - Password strength requirements

### 2. JWT Authentication
- **24 hour expiry** - Automatic token expiration
- **Secure headers** - Proper Authorization header usage
- **Token validation** - Server-side verification

### 3. Rate Limiting
- **Login attempts: 5 per 15 min** - Prevent brute force
- **IP-based limiting** - Per-IP restrictions
- **Lockout duration: 15 minutes** - Temporary account locks

### 4. Input Validation
- **Email format** - Proper email validation
- **Username uniqueness** - No duplicate usernames
- **SQL injection prevention** - Parameterized queries (when using SQL)

## 📱 Responsive Design

### Breakpoints
- **Desktop**: >1024px - Full features
- **Tablet**: 768-1024px - Adapted layout
- **Mobile**: <768px - Mobile-optimized forms
- **Small Mobile**: <480px - Compact design

### Mobile Features
- ✅ Touch-friendly buttons
- ✅ Optimized form layouts  
- ✅ Reduced 3D animations (performance)
- ✅ Swipe gestures support

## 🎯 Testing Guide

### 1. Frontend Testing
```bash
# Buka browser dan test:
1. Open login.html
2. Try demo account buttons
3. Test form validations
4. Test login/register flows  
5. Check responsive design
```

### 2. Backend Testing
```bash
# Start server
cd backend && npm start

# Test endpoints
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

### 3. Integration Testing
```bash
1. Start backend server
2. Open index.html
3. Click "Masuk" button
4. Login with demo account
5. Try adding products to cart
6. Check user menu dropdown
```

## 🚨 Troubleshooting

### Backend Server Issues
```bash
# Port already in use
sudo lsof -i :3001
kill -9 PID_NUMBER

# Dependencies issues  
rm -rf node_modules
npm install

# Permission issues
chmod +x setup.sh
```

### Frontend Issues
```bash
# CORS errors (if using backend)
- Start backend server first
- Use proper API URLs

# 3D animations not working
- Check browser WebGL support
- Check console for Three.js errors

# Authentication not working
- Check localStorage/sessionStorage
- Verify token expiry
- Check API connectivity
```

## 🔄 Database Management

### Backup Database
```bash
# Manual backup
cp database/users.json database/users_backup_$(date +%Y%m%d).json

# Automated daily backup (cron)
0 2 * * * cp /path/to/database/users.json /path/to/backups/users_$(date +%Y%m%d).json
```

### Reset Database
```bash
# Reset to default demo users
git checkout database/users.json

# Or manually edit database/users.json
```

### Add New Users Manually
```json
// Edit database/users.json
{
  "id": 5,
  "username": "newuser",
  "email": "new@email.com", 
  "password": "$2b$10$hashedPassword",
  "fullName": "New User",
  "role": "customer",
  "avatar": "👤",
  "createdAt": "2024-01-15T12:00:00Z",
  "lastLogin": null,
  "isActive": true,
  "preferences": {
    "theme": "dark",
    "language": "id", 
    "notifications": true
  },
  "address": {
    "street": "",
    "city": "",
    "state": "",
    "zipCode": "",
    "country": "Indonesia"
  },
  "phone": ""
}
```

## 📈 Performance Optimization

### Frontend
- ✅ **Lazy Loading** - 3D scenes load on demand
- ✅ **Mobile Optimization** - Reduced animations on mobile
- ✅ **Asset Optimization** - Minified CSS/JS for production
- ✅ **Caching Strategy** - Browser caching for static assets

### Backend
- ✅ **Memory Management** - Efficient JSON file handling
- ✅ **Rate Limiting** - Prevent server overload
- ✅ **Error Handling** - Graceful error responses
- ✅ **Request Validation** - Input sanitization

## 🔮 Future Enhancements

### Database Upgrades
- [ ] **PostgreSQL Integration** - Production database
- [ ] **MongoDB Support** - NoSQL alternative
- [ ] **Database Migrations** - Schema version management
- [ ] **Redis Caching** - Session and data caching

### Authentication Features
- [ ] **OAuth Integration** - Google/Facebook login
- [ ] **Two-Factor Auth** - SMS/Email verification
- [ ] **Password Reset** - Email-based recovery
- [ ] **Role-based Permissions** - Granular access control

### UI/UX Improvements  
- [ ] **Progressive Web App** - Offline functionality
- [ ] **Dark/Light Theme** - User preference toggle
- [ ] **Multi-language** - Indonesian/English support
- [ ] **Advanced 3D** - More interactive 3D elements

## 📞 Support & Contact

### Getting Help
1. **Check Documentation** - README files in each folder
2. **Check Issues** - Common problems and solutions
3. **Test with Demo Accounts** - Verify basic functionality
4. **Enable Debug Mode** - Check browser console

### Development Support
- **Frontend Issues**: Check `js/script.js` and `js/auth.js`
- **Backend Issues**: Check `backend/server.js` and logs
- **Database Issues**: Verify `database/users.json` structure
- **CSS Issues**: Check `css/style.css` and `css/auth.css`

---

## ✅ Checklist Implementasi

### ✅ Database System
- [x] User data structure
- [x] JSON file database  
- [x] CRUD operations
- [x] Data validation
- [x] Backup procedures

### ✅ Authentication System
- [x] Login functionality
- [x] Registration system
- [x] JWT token management
- [x] Password hashing
- [x] Session management

### ✅ Security Features
- [x] Rate limiting
- [x] Input validation
- [x] XSS protection
- [x] Password requirements
- [x] Token expiry

### ✅ Frontend Integration
- [x] Login/register pages
- [x] 3D animations
- [x] Form validation
- [x] Error handling
- [x] User interface updates

### ✅ Backend API
- [x] Express server
- [x] API endpoints
- [x] Error handling
- [x] CORS support
- [x] Request logging

### ✅ Documentation
- [x] Setup guide
- [x] API documentation
- [x] Database schema
- [x] Security guidelines
- [x] Troubleshooting guide

---

**🎉 Database login system Anda telah siap digunakan!**

*Sistem authentication yang aman, modern, dan mudah digunakan untuk website 3D Marketplace.*
