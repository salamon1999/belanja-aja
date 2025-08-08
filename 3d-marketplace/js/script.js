// Global variables
let heroScene, heroCamera, heroRenderer, heroMesh;
let categoryScenes = [];
let productScenes = [];
let aboutScene, aboutCamera, aboutRenderer, aboutMesh;
let cart = [];
let cartTotal = 0;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initHero3D();
    initCategory3D();
    initProduct3D();
    initAbout3D();
    initEventListeners();
    initScrollAnimations();
    updateCartDisplay();
    initAuthIntegration();
});

// Hero 3D Animation
function initHero3D() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    heroScene = new THREE.Scene();
    heroCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    heroRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
    heroRenderer.setClearColor(0x000000, 0);

    // Create floating geometric shapes
    const shapes = [];
    const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.7, 16, 16),
        new THREE.ConeGeometry(0.5, 1.2, 8),
        new THREE.TorusGeometry(0.6, 0.2, 8, 16),
        new THREE.OctahedronGeometry(0.8)
    ];

    // Create materials with gradients
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0xec4899, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true })
    ];

    // Create multiple floating shapes
    for (let i = 0; i < 15; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 20;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatOffset: Math.random() * Math.PI * 2,
            floatSpeed: 0.01 + Math.random() * 0.02
        };
        
        shapes.push(mesh);
        heroScene.add(mesh);
    }

    heroCamera.position.z = 15;

    // Animation loop for hero
    function animateHero() {
        requestAnimationFrame(animateHero);
        
        const time = Date.now() * 0.001;
        
        shapes.forEach(shape => {
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;
            
            shape.position.y += Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.01;
        });
        
        heroCamera.position.x = Math.sin(time * 0.2) * 2;
        heroCamera.lookAt(0, 0, 0);
        
        heroRenderer.render(heroScene, heroCamera);
    }
    
    animateHero();
}

// Category 3D Animations
function initCategory3D() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach((card, index) => {
        const canvas = card.querySelector('.category-canvas');
        if (!canvas) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setClearColor(0x000000, 0);
        
        // Different shapes for different categories
        const categoryType = card.dataset.category;
        let geometry, material, mesh;
        
        switch(categoryType) {
            case 'elektronik':
                geometry = new THREE.BoxGeometry(2, 1.2, 0.3);
                material = new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true });
                break;
            case 'fashion':
                geometry = new THREE.SphereGeometry(1, 8, 6);
                material = new THREE.MeshBasicMaterial({ color: 0xec4899, wireframe: true });
                break;
            case 'furniture':
                geometry = new THREE.BoxGeometry(1.5, 1.8, 1.5);
                material = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
                break;
            case 'olahraga':
                geometry = new THREE.SphereGeometry(1.2, 16, 16);
                material = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true });
                break;
            default:
                geometry = new THREE.BoxGeometry(1, 1, 1);
                material = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true });
        }
        
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        camera.position.z = 5;
        
        categoryScenes.push({ scene, camera, renderer, mesh });
        
        // Animation loop for category
        function animateCategory() {
            requestAnimationFrame(animateCategory);
            
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;
            
            renderer.render(scene, camera);
        }
        
        animateCategory();
        
        // Hover effects
        card.addEventListener('mouseenter', () => {
            gsap.to(mesh.scale, { duration: 0.3, x: 1.2, y: 1.2, z: 1.2 });
            gsap.to(mesh.rotation, { duration: 0.3, y: mesh.rotation.y + Math.PI });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(mesh.scale, { duration: 0.3, x: 1, y: 1, z: 1 });
        });
    });
}

// Product 3D Animations
function initProduct3D() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        const canvas = card.querySelector('.product-canvas');
        if (!canvas) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setClearColor(0x000000, 0);
        
        // Create product representation based on index
        let geometry, material, mesh;
        const colors = [0x6366f1, 0xec4899, 0x8b5cf6, 0xf59e0b, 0x10b981, 0xef4444];
        
        const productGeometries = [
            new THREE.BoxGeometry(1.5, 2.5, 0.2), // Phone
            new THREE.BoxGeometry(3, 0.3, 2),     // Laptop
            new THREE.BoxGeometry(1.2, 0.8, 2.2), // Shoe
            new THREE.BoxGeometry(2, 2.5, 2),     // Chair
            new THREE.BoxGeometry(2.5, 1, 4),     // Console
            new THREE.BoxGeometry(1.5, 2.8, 0.2)  // Phone 2
        ];
        
        geometry = productGeometries[index % productGeometries.length];
        material = new THREE.MeshBasicMaterial({ 
            color: colors[index % colors.length], 
            wireframe: true 
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        camera.position.z = 6;
        
        productScenes.push({ scene, camera, renderer, mesh, card });
        
        // Animation loop for product
        function animateProduct() {
            requestAnimationFrame(animateProduct);
            
            mesh.rotation.y += 0.005;
            
            renderer.render(scene, camera);
        }
        
        animateProduct();
        
        // Hover effects
        card.addEventListener('mouseenter', () => {
            gsap.to(mesh.scale, { duration: 0.3, x: 1.1, y: 1.1, z: 1.1 });
            gsap.to(mesh.rotation, { duration: 0.3, x: 0.3 });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(mesh.scale, { duration: 0.3, x: 1, y: 1, z: 1 });
            gsap.to(mesh.rotation, { duration: 0.3, x: 0 });
        });
    });
}

// About section 3D
function initAbout3D() {
    const canvas = document.getElementById('about-canvas');
    if (!canvas) return;

    aboutScene = new THREE.Scene();
    aboutCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    aboutRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    aboutRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    aboutRenderer.setClearColor(0x000000, 0);

    // Create interconnected network of nodes
    const nodes = [];
    const connections = [];
    
    // Create nodes
    for (let i = 0; i < 10; i++) {
        const nodeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        
        node.position.x = (Math.random() - 0.5) * 8;
        node.position.y = (Math.random() - 0.5) * 6;
        node.position.z = (Math.random() - 0.5) * 4;
        
        nodes.push(node);
        aboutScene.add(node);
    }
    
    // Create connections between nodes
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (Math.random() < 0.3) { // 30% chance of connection
                const points = [nodes[i].position, nodes[j].position];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({ color: 0xec4899, opacity: 0.6, transparent: true });
                const line = new THREE.Line(geometry, material);
                connections.push(line);
                aboutScene.add(line);
            }
        }
    }

    aboutCamera.position.z = 8;

    // Animation loop for about
    function animateAbout() {
        requestAnimationFrame(animateAbout);
        
        const time = Date.now() * 0.001;
        
        nodes.forEach((node, index) => {
            node.position.y += Math.sin(time + index) * 0.01;
        });
        
        aboutCamera.position.x = Math.sin(time * 0.5) * 2;
        aboutCamera.lookAt(0, 0, 0);
        
        aboutRenderer.render(aboutScene, aboutCamera);
    }
    
    animateAbout();
}

// Event listeners
function initEventListeners() {
    // Cart functionality
    const cartBtn = document.querySelector('.cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.querySelector('.close');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            cartModal.style.display = 'block';
            updateCartModal();
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    addToCartBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Check if user is authenticated
            if (window.AuthSystem && !window.AuthSystem.isAuthenticated()) {
                showNotification('Silakan login terlebih dahulu untuk menambahkan produk ke keranjang');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }
            
            addToCart(index);
        });
    });
    
    // Smooth scrolling for navigation
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('#products').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Category buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('#products').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Login button
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
}

// Cart functionality
function addToCart(productIndex) {
    const products = [
        { name: 'iPhone 15 Pro', price: 18999000, image: '📱' },
        { name: 'MacBook Air M3', price: 21999000, image: '💻' },
        { name: 'Nike Air Jordan', price: 2499000, image: '👟' },
        { name: 'Gaming Chair Pro', price: 3999000, image: '🪑' },
        { name: 'PlayStation 5', price: 8999000, image: '🎮' },
        { name: 'Samsung Galaxy S24', price: 14999000, image: '📱' }
    ];
    
    const product = products[productIndex];
    if (product) {
        cart.push(product);
        cartTotal += product.price;
        updateCartDisplay();
        
        // Show success animation
        showNotification(`${product.name} ditambahkan ke keranjang!`);
    }
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
    
    if (cart.length > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
}

function updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--gray-text);">Keranjang kosong</p>';
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                margin-bottom: 1rem;
                background: rgba(99, 102, 241, 0.1);
                border-radius: 8px;
            `;
            
            cartItem.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 2rem;">${item.image}</span>
                    <div>
                        <h4 style="color: var(--light-text); margin-bottom: 0.25rem;">${item.name}</h4>
                        <p style="color: var(--accent-color); font-weight: 600;">Rp ${item.price.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                <button onclick="removeFromCart(${index})" style="
                    background: var(--secondary-color);
                    color: white;
                    border: none;
                    padding: 0.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.9rem;
                ">Hapus</button>
            `;
            
            cartItems.appendChild(cartItem);
        });
    }
    
    cartTotalAmount.textContent = `Rp ${cartTotal.toLocaleString('id-ID')}`;
}

function removeFromCart(index) {
    if (cart[index]) {
        cartTotal -= cart[index].price;
        cart.splice(index, 1);
        updateCartDisplay();
        updateCartModal();
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--gradient-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 3000;
        font-weight: 600;
        box-shadow: var(--shadow-soft);
        transform: translateX(300px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.category-card, .product-card, .feature, .stat-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for sections
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        }
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    // Update hero canvas
    if (heroCamera && heroRenderer) {
        heroCamera.aspect = window.innerWidth / window.innerHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Update category canvases
    categoryScenes.forEach(({ camera, renderer }, index) => {
        const canvas = document.querySelectorAll('.category-canvas')[index];
        if (canvas) {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
    });
    
    // Update product canvases
    productScenes.forEach(({ camera, renderer }, index) => {
        const canvas = document.querySelectorAll('.product-canvas')[index];
        if (canvas) {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
    });
    
    // Update about canvas
    if (aboutCamera && aboutRenderer) {
        const canvas = document.getElementById('about-canvas');
        if (canvas) {
            aboutCamera.aspect = canvas.clientWidth / canvas.clientHeight;
            aboutCamera.updateProjectionMatrix();
            aboutRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
    }
});

// Performance optimization
function optimizePerformance() {
    // Reduce animations on mobile
    if (window.innerWidth < 768) {
        // Disable some heavy animations on mobile
        const heroCanvas = document.getElementById('hero-canvas');
        if (heroCanvas) {
            heroCanvas.style.display = 'none';
        }
    }
}

// Initialize performance optimizations
optimizePerformance();
window.addEventListener('resize', optimizePerformance);

// Authentication integration
function initAuthIntegration() {
    // Check if user is logged in and update UI
    if (window.AuthSystem && window.AuthSystem.isAuthenticated()) {
        const currentUser = window.AuthSystem.getCurrentUser();
        updateUIForLoggedInUser(currentUser);
    }
}

function updateUIForLoggedInUser(user) {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn && user) {
        // Replace login button with user info
        loginBtn.innerHTML = `${user.avatar} ${user.fullName}`;
        loginBtn.style.cursor = 'pointer';
        
        // Add dropdown menu for user actions
        loginBtn.addEventListener('click', showUserMenu);
    }
}

function showUserMenu() {
    // Create user menu dropdown
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const user = window.AuthSystem.getCurrentUser();
    const loginBtn = document.querySelector('.login-btn');
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--dark-card);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 8px;
        padding: 0.5rem 0;
        min-width: 200px;
        box-shadow: var(--shadow-soft);
        z-index: 1001;
        margin-top: 0.5rem;
    `;
    
    menu.innerHTML = `
        <div style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);">
            <div style="color: var(--light-text); font-weight: 600;">${user.fullName}</div>
            <div style="color: var(--gray-text); font-size: 0.8rem;">${user.email}</div>
            <div style="color: var(--accent-color); font-size: 0.7rem; margin-top: 0.25rem;">${user.role === 'admin' ? '👑 Admin' : '👤 Customer'}</div>
        </div>
        <a href="#" class="menu-item profile-link" style="display: block; padding: 0.75rem 1rem; color: var(--gray-text); text-decoration: none; transition: var(--transition);">
            👤 Profile Saya
        </a>
        <a href="#" class="menu-item orders-link" style="display: block; padding: 0.75rem 1rem; color: var(--gray-text); text-decoration: none; transition: var(--transition);">
            📦 Pesanan Saya
        </a>
        <a href="#" class="menu-item settings-link" style="display: block; padding: 0.75rem 1rem; color: var(--gray-text); text-decoration: none; transition: var(--transition);">
            ⚙️ Pengaturan
        </a>
        <div style="border-top: 1px solid rgba(99, 102, 241, 0.2); margin: 0.5rem 0;"></div>
        <a href="#" class="menu-item logout-link" style="display: block; padding: 0.75rem 1rem; color: var(--secondary-color); text-decoration: none; transition: var(--transition);">
            🚪 Logout
        </a>
    `;
    
    // Position menu relative to login button
    loginBtn.style.position = 'relative';
    loginBtn.appendChild(menu);
    
    // Add hover effects
    const menuItems = menu.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.background = 'rgba(99, 102, 241, 0.1)';
            item.style.color = 'var(--light-text)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.background = 'transparent';
            if (!item.classList.contains('logout-link')) {
                item.style.color = 'var(--gray-text)';
            }
        });
    });
    
    // Add logout functionality
    const logoutLink = menu.querySelector('.logout-link');
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin logout?')) {
            window.AuthSystem.logout();
        }
    });
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && e.target !== loginBtn) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Export functions for global access
window.removeFromCart = removeFromCart;
