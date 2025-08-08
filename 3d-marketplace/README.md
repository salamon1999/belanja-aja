# 3D Marketplace - Website Marketplace Modern dengan Visual 3D

Sebuah website marketplace modern yang menampilkan pengalaman berbelanja online yang revolusioner dengan teknologi 3D yang menakjubkan.

## ✨ Fitur Utama

- **🌟 Visual 3D Interaktif**: Pengalaman visual 3D yang memukau menggunakan Three.js
- **🛒 Keranjang Belanja**: Sistem keranjang belanja yang responsif dan dinamis
- **📱 Responsive Design**: Tampilan yang optimal di semua perangkat
- **🎨 Modern UI/UX**: Desain modern dengan gradien dan animasi yang halus
- **⚡ Performance Optimized**: Optimasi kinerja untuk pengalaman pengguna yang lancar
- **🚀 Smooth Animations**: Animasi yang halus dengan GSAP
- **🎯 Interactive Elements**: Elemen-elemen interaktif yang menarik

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Struktur semantik modern
- **CSS3**: Styling lanjutan dengan custom properties dan animasi
- **JavaScript (ES6+)**: Logika aplikasi modern
- **Three.js**: Library 3D untuk rendering objek 3D
- **GSAP**: Library animasi untuk efek yang halus
- **Inter Font**: Typography modern dari Google Fonts

## 📁 Struktur Project

```
3d-marketplace/
│
├── index.html          # File HTML utama
├── css/
│   └── style.css       # Styling CSS
├── js/
│   └── script.js       # JavaScript functionality
├── assets/             # Folder untuk aset tambahan
├── images/             # Folder untuk gambar
└── README.md          # Dokumentasi ini
```

## 🚀 Cara Menjalankan

1. **Clone atau Download Project**
   ```bash
   git clone <repository-url>
   cd 3d-marketplace
   ```

2. **Buka dengan Live Server**
   - Gunakan extension Live Server di VS Code
   - Atau buka `index.html` langsung di browser
   - Atau jalankan dengan Python:
     ```bash
     python -m http.server 8000
     ```

3. **Akses Website**
   - Buka browser dan pergi ke `http://localhost:8000`
   - Atau buka file `index.html` langsung

## 🎮 Cara Menggunakan

### Navigasi
- **Navbar**: Klik menu untuk navigasi halus ke setiap section
- **Hero Section**: Area utama dengan animasi 3D background
- **Categories**: Jelajahi kategori produk dengan visual 3D interaktif
- **Products**: Lihat produk unggulan dengan representasi 3D

### Shopping Cart
- **Tambah Produk**: Klik "Tambah ke Keranjang" pada produk yang diinginkan
- **Lihat Keranjang**: Klik ikon keranjang di navbar
- **Kelola Keranjang**: Hapus item atau lakukan checkout

### Interaktivitas 3D
- **Hero Animation**: Objek 3D bergerak dan berputar otomatis
- **Category Cards**: Hover untuk efek skala dan rotasi
- **Product Cards**: Hover untuk efek zoom dan rotasi
- **About Section**: Visualisasi jaringan node yang dinamis

## 🎨 Kustomisasi

### Colors
Ubah warna di file `css/style.css` pada bagian `:root`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    --accent-color: #f59e0b;
    /* ... warna lainnya */
}
```

### 3D Objects
Modifikasi objek 3D di file `js/script.js`:
- Ubah geometri di fungsi `initHero3D()`
- Sesuaikan material dan warna
- Tambah atau kurangi jumlah objek

### Products
Edit array produk di `js/script.js`:
```javascript
const products = [
    { name: 'Product Name', price: 1000000, image: '📱' },
    // tambah produk lainnya
];
```

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

## ⚡ Optimasi Performance

- **Mobile Optimization**: Animasi 3D dikurangi di perangkat mobile
- **Lazy Loading**: Elemen dimuat saat diperlukan
- **Efficient Rendering**: Menggunakan requestAnimationFrame untuk animasi
- **Responsive Images**: Gambar dioptimalkan untuk berbagai ukuran layar

## 🌟 Fitur Tambahan

### Animations
- **Scroll Animations**: Elemen muncul saat di-scroll
- **Hover Effects**: Efek interaktif saat hover
- **Loading States**: Indikator loading untuk UX yang lebih baik
- **Page Transitions**: Transisi halus antar section

### Accessibility
- **Semantic HTML**: Struktur HTML yang mudah dibaca screen reader
- **Keyboard Navigation**: Navigasi dengan keyboard
- **Color Contrast**: Kontras warna yang memadai
- **Alt Text**: Deskripsi untuk elemen visual

## 🔧 Development

### Prerequisites
- Browser modern dengan dukungan ES6+
- Web server lokal (opsional)

### Best Practices
- **Clean Code**: Kode yang rapi dan mudah dibaca
- **Modularity**: Fungsi-fungsi terpisah untuk kemudahan maintenance
- **Performance**: Optimasi kinerja untuk loading yang cepat
- **Cross-browser**: Kompatibilitas dengan browser utama

## 📞 Support

Jika mengalami masalah atau membutuhkan bantuan:
- Buat issue di repository ini
- Hubungi developer melalui email
- Cek dokumentasi Three.js dan GSAP

## 🔄 Updates

### Version 1.0.0
- ✅ Basic 3D marketplace structure
- ✅ Shopping cart functionality
- ✅ Responsive design
- ✅ 3D animations with Three.js
- ✅ Modern UI/UX design

### Planned Features
- 🔘 User authentication
- 🔘 Product search and filtering
- 🔘 Payment integration
- 🔘 Product reviews and ratings
- 🔘 Wishlist functionality
- 🔘 Advanced 3D product visualization

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Credits

- **Three.js**: Untuk rendering 3D
- **GSAP**: Untuk animasi yang smooth
- **Inter Font**: Typography yang modern
- **Inspiration**: Desain modern marketplace

---

**Happy Coding! 🚀**

*Dibuat dengan ❤️ untuk pengalaman berbelanja online yang lebih menarik*
