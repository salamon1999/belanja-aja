#!/bin/bash

# 3D Marketplace Setup Script
# Otomatis install dependencies dan setup backend

echo "🚀 Setting up 3D Marketplace..."
echo "================================"

# Cek apakah Node.js sudah terinstall
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak ditemukan!"
    echo "Silakan install Node.js terlebih dahulu dari https://nodejs.org/"
    exit 1
fi

# Cek apakah npm sudah terinstall
if ! command -v npm &> /dev/null; then
    echo "❌ npm tidak ditemukan!"
    echo "Silakan install npm terlebih dahulu"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Masuk ke folder backend
cd backend

echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully!"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo "================================"
echo ""
echo "📝 Demo Accounts:"
echo "   Admin: admin / admin123"
echo "   User1: johndoe / john123" 
echo "   User2: sarah / sarah123"
echo "   Demo:  demo / demo123"
echo ""
echo "🚀 To start the backend server:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "🌐 To start development server:"
echo "   cd backend" 
echo "   npm run dev"
echo ""
echo "📖 Open index.html in browser to view the website"
echo "🔐 Open login.html to test the authentication system"
echo ""
echo "Backend will run on: http://localhost:3001"
echo "Frontend can be opened directly in browser"
