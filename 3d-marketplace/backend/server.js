const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || '3d-marketplace-secret-key-2024';
const DATABASE_PATH = path.join(__dirname, '../database/users.json');

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting untuk login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper functions
async function readDatabase() {
  try {
    const data = await fs.readFile(DATABASE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    throw new Error('Database tidak dapat diakses');
  }
}

async function writeDatabase(data) {
  try {
    await fs.writeFile(DATABASE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw new Error('Database tidak dapat disimpan');
  }
}

// Middleware untuk verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token tidak valid' });
    }
    req.user = user;
    next();
  });
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '3D Marketplace API is running',
    timestamp: new Date().toISOString()
  });
});

// Login endpoint
app.post('/api/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username dan password harus diisi' 
      });
    }

    const database = await readDatabase();
    const user = database.users.find(u => 
      u.username === username || u.email === username
    );

    if (!user) {
      return res.status(401).json({ 
        error: 'Username atau password salah' 
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        error: 'Akun Anda telah dinonaktifkan' 
      });
    }

    // Untuk demo, kita gunakan password simple comparison
    // Dalam production, gunakan bcrypt.compare()
    const validPassword = await validatePassword(password, user.password, username);
    
    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Username atau password salah' 
      });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    await writeDatabase(database);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create session
    const session = {
      id: Date.now().toString(),
      userId: user.id,
      token: token,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      userAgent: req.headers['user-agent'],
      ip: req.ip
    };

    database.sessions.push(session);
    await writeDatabase(database);

    res.json({
      success: true,
      message: 'Login berhasil',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan server' 
    });
  }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ 
        error: 'Semua field harus diisi' 
      });
    }

    // Validasi password
    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'Password minimal 8 karakter' 
      });
    }

    const database = await readDatabase();
    
    // Check if user already exists
    const existingUser = database.users.find(u => 
      u.username === username || u.email === email
    );

    if (existingUser) {
      return res.status(409).json({ 
        error: 'Username atau email sudah digunakan' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Math.max(...database.users.map(u => u.id)) + 1,
      username: username,
      email: email,
      password: hashedPassword,
      fullName: fullName,
      role: 'customer',
      avatar: '👤',
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isActive: true,
      preferences: {
        theme: 'dark',
        language: 'id',
        notifications: true
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Indonesia'
      },
      phone: ''
    };

    database.users.push(newUser);
    await writeDatabase(database);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan server' 
    });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const user = database.users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ 
        error: 'User tidak ditemukan' 
      });
    }

    const userProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      preferences: user.preferences,
      address: user.address,
      phone: user.phone
    };

    res.json({
      success: true,
      user: userProfile
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan server' 
    });
  }
});

// Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const userIndex = database.users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ 
        error: 'User tidak ditemukan' 
      });
    }

    const allowedFields = ['fullName', 'phone', 'address', 'preferences'];
    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    Object.assign(database.users[userIndex], updateData);
    await writeDatabase(database);

    res.json({
      success: true,
      message: 'Profile berhasil diupdate',
      user: {
        id: database.users[userIndex].id,
        username: database.users[userIndex].username,
        email: database.users[userIndex].email,
        fullName: database.users[userIndex].fullName,
        role: database.users[userIndex].role,
        avatar: database.users[userIndex].avatar,
        preferences: database.users[userIndex].preferences,
        address: database.users[userIndex].address,
        phone: database.users[userIndex].phone
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan server' 
    });
  }
});

// Logout endpoint
app.post('/api/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    const database = await readDatabase();
    
    // Remove session
    database.sessions = database.sessions.filter(s => s.token !== token);
    await writeDatabase(database);

    res.json({
      success: true,
      message: 'Logout berhasil'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan server' 
    });
  }
});

// Change password
app.post('/api/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Password lama dan baru harus diisi' 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        error: 'Password baru minimal 8 karakter' 
      });
    }

    const database = await readDatabase();
    const userIndex = database.users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ 
        error: 'User tidak ditemukan' 
      });
    }

    const user = database.users[userIndex];
    const validCurrentPassword = await validatePassword(currentPassword, user.password, user.username);

    if (!validCurrentPassword) {
      return res.status(401).json({ 
        error: 'Password lama salah' 
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    database.users[userIndex].password = hashedNewPassword;

    await writeDatabase(database);

    res.json({
      success: true,
      message: 'Password berhasil diubah'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan server' 
    });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Akses ditolak. Admin only.' 
      });
    }

    const database = await readDatabase();
    const users = database.users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive
    }));

    res.json({
      success: true,
      users: users,
      total: users.length
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan server' 
    });
  }
});

// Helper function untuk validasi password
async function validatePassword(inputPassword, hashedPassword, username) {
  // Untuk demo users dengan password simple
  const demoPasswords = {
    'admin': 'admin123',
    'johndoe': 'john123',
    'sarah': 'sarah123',
    'demo': 'demo123'
  };

  if (demoPasswords[username] && demoPasswords[username] === inputPassword) {
    return true;
  }

  // Untuk password yang di-hash dengan bcrypt
  try {
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch (error) {
    return false;
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint tidak ditemukan' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 3D Marketplace API Server running on http://localhost:${PORT}`);
  console.log(`📊 Database path: ${DATABASE_PATH}`);
  console.log(`🔐 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
  console.log('');
  console.log('📝 Demo Accounts:');
  console.log('   Admin: admin / admin123');
  console.log('   User1: johndoe / john123');
  console.log('   User2: sarah / sarah123');
  console.log('   Demo:  demo / demo123');
});

module.exports = app;
