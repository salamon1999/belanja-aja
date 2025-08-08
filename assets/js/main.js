// ===== DOM ELEMENTS =====
const navbar = document.querySelector('.navbar');
const navMenu = document.getElementById('navMenu');
const searchContainer = document.getElementById('searchContainer');
const productGrid = document.getElementById('productGrid');
const backToTopBtn = document.getElementById('backToTop');

// ===== SAMPLE PRODUCTS DATA =====
const sampleProducts = [
    {
        id: 1,
        name: "Smartphone Android Terbaru",
        price: "Rp 3.999.000",
        originalPrice: "Rp 4.999.000",
        rating: 4.8,
        reviews: 125,
        image: "📱"
    },
    {
        id: 2,
        name: "Laptop Gaming High Performance",
        price: "Rp 12.999.000",
        originalPrice: "Rp 15.999.000",
        rating: 4.9,
        reviews: 89,
        image: "💻"
    },
    {
        id: 3,
        name: "Sepatu Olahraga Premium",
        price: "Rp 899.000",
        originalPrice: "Rp 1.299.000",
        rating: 4.7,
        reviews: 234,
        image: "👟"
    },
    {
        id: 4,
        name: "Jam Tangan Smart Watch",
        price: "Rp 2.499.000",
        originalPrice: "Rp 3.499.000",
        rating: 4.6,
        reviews: 156,
        image: "⌚"
    },
    {
        id: 5,
        name: "Headphone Wireless Premium",
        price: "Rp 1.799.000",
        originalPrice: "Rp 2.299.000",
        rating: 4.8,
        reviews: 178,
        image: "🎧"
    },
    {
        id: 6,
        name: "Kamera DSLR Professional",
        price: "Rp 8.999.000",
        originalPrice: "Rp 11.999.000",
        rating: 4.9,
        reviews: 67,
        image: "📷"
    }
];

// ===== MOBILE MENU TOGGLE =====
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
}

// ===== SEARCH TOGGLE =====
function toggleSearch() {
    searchContainer.classList.toggle('active');
    if (searchContainer.classList.contains('active')) {
        const searchInput = document.querySelector('.search-input');
        searchInput.focus();
    }
}

// ===== SMOOTH SCROLLING =====
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ===== SCROLL TO TOP =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== LOAD PRODUCTS =====
function loadProducts() {
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    sampleProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// ===== CREATE PRODUCT CARD =====
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    card.innerHTML = `
        <div class="product-image">
            <span style="font-size: 4rem;">${product.image}</span>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
                ${product.price}
                <span style="text-decoration: line-through; color: #999; font-size: 0.9rem; margin-left: 0.5rem;">${product.originalPrice}</span>
            </div>
            <div class="product-rating">
                <span class="stars">${stars}</span>
                <span style="color: #666;">${product.rating} (${product.reviews} ulasan)</span>
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;" onclick="addToCart(${product.id})">
                <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
            </button>
        </div>
    `;
    
    return card;
}

// ===== ADD TO CART =====
function addToCart(productId) {
    // Simulate adding to cart
    const product = sampleProducts.find(p => p.id === productId);
    if (product) {
        // Create notification
        showNotification(`${product.name} berhasil ditambahkan ke keranjang!`, 'success');
        
        // Update cart icon (you can implement cart counter here)
        const cartIcon = document.querySelector('.fa-shopping-cart');
        cartIcon.style.color = '#FFD700';
        setTimeout(() => {
            cartIcon.style.color = '';
        }, 1000);
    }
}

// ===== LOAD MORE PRODUCTS =====
function loadMoreProducts() {
    // Simulate loading more products
    const moreProducts = [
        {
            id: 7,
            name: "Tablet Android 10 inch",
            price: "Rp 2.799.000",
            originalPrice: "Rp 3.299.000",
            rating: 4.5,
            reviews: 92,
            image: "📱"
        },
        {
            id: 8,
            name: "Speaker Bluetooth Portable",
            price: "Rp 599.000",
            originalPrice: "Rp 799.000",
            rating: 4.6,
            reviews: 143,
            image: "🔊"
        }
    ];
    
    moreProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
    
    showNotification('Produk baru berhasil dimuat!', 'info');
}

// ===== SHOW NOTIFICATION =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ===== HANDLE SCROLL EVENTS =====
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show/hide back to top button
    if (scrollTop > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
    
    // Add shadow to navbar when scrolling
    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
}

// ===== HANDLE FORM SUBMISSION =====
function handleContactForm() {
    const form = document.querySelector('.contact-form form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const subject = form.querySelectorAll('input[type="text"]')[1].value;
            const message = form.querySelector('textarea').value;
            
            if (name && email && subject && message) {
                showNotification('Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
                form.reset();
            } else {
                showNotification('Mohon isi semua field yang diperlukan.', 'error');
            }
        });
    }
}

// ===== ANIMATE ON SCROLL =====
function animateOnScroll() {
    const elements = document.querySelectorAll('.category-card, .product-card, .feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        });
    });
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', function() {
    // Load initial products
    loadProducts();
    
    // Setup event listeners
    window.addEventListener('scroll', handleScroll);
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup form handling
    handleContactForm();
    
    // Setup animation on scroll
    setTimeout(animateOnScroll, 500);
    
    // Setup search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                showNotification(`Mencari: "${searchTerm}"...`, 'info');
                // Here you can implement actual search functionality
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
    
    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target) && !e.target.classList.contains('fa-search')) {
            searchContainer.classList.remove('active');
        }
        
        // Close mobile menu when clicking outside
        if (!navMenu.contains(e.target) && !e.target.classList.contains('fa-bars')) {
            navMenu.classList.remove('active');
        }
    });
    
    // Welcome message
    setTimeout(() => {
        showNotification('Selamat datang di Belanja Aja! 🛍️', 'success');
    }, 1000);
});

// ===== UTILITY FUNCTIONS =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== PERFORMANCE OPTIMIZATIONS =====
const debouncedScroll = debounce(handleScroll, 10);
window.addEventListener('scroll', debouncedScroll);
