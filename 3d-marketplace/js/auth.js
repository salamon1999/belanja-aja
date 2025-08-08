// Auth system global variables
const API_BASE_URL = 'http://localhost:3001/api';
let authScene, authCamera, authRenderer;
let currentUser = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAuth3D();
    initAuthEventListeners();
    checkExistingAuth();
});

// Initialize 3D background for auth page
function initAuth3D() {
    const canvas = document.getElementById('auth-canvas');
    if (!canvas) return;

    authScene = new THREE.Scene();
    authCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    authRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    authRenderer.setSize(window.innerWidth, window.innerHeight);
    authRenderer.setClearColor(0x000000, 0);

    // Create floating particles
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.02, 4, 4);
        const material = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color().setHSL(Math.random(), 0.8, 0.8),
            transparent: true,
            opacity: 0.6
        });
        const particle = new THREE.Mesh(geometry, material);
        
        particle.position.x = (Math.random() - 0.5) * 50;
        particle.position.y = (Math.random() - 0.5) * 30;
        particle.position.z = (Math.random() - 0.5) * 30;
        
        particle.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            ),
            originalPosition: particle.position.clone()
        };
        
        particles.push(particle);
        authScene.add(particle);
    }

    authCamera.position.z = 15;

    // Animation loop
    function animateAuth() {
        requestAnimationFrame(animateAuth);
        
        const time = Date.now() * 0.0005;
        
        particles.forEach((particle, index) => {
            particle.position.add(particle.userData.velocity);
            
            // Boundary check
            if (Math.abs(particle.position.x) > 25) particle.userData.velocity.x *= -1;
            if (Math.abs(particle.position.y) > 15) particle.userData.velocity.y *= -1;
            if (Math.abs(particle.position.z) > 15) particle.userData.velocity.z *= -1;
            
            // Floating effect
            particle.position.y += Math.sin(time + index * 0.1) * 0.001;
            
            // Color change
            const hue = (time + index * 0.1) % 1;
            particle.material.color.setHSL(hue, 0.8, 0.8);
        });
        
        authCamera.position.x = Math.sin(time * 0.5) * 2;
        authCamera.lookAt(0, 0, 0);
        
        authRenderer.render(authScene, authCamera);
    }
    
    animateAuth();
}

// Initialize event listeners
function initAuthEventListeners() {
    // Form switching
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchToRegister();
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchToLogin();
        });
    }

    // Form submissions
    const loginFormSubmit = document.getElementById('loginFormSubmit');
    const registerFormSubmit = document.getElementById('registerFormSubmit');

    if (loginFormSubmit) {
        loginFormSubmit.addEventListener('submit', handleLogin);
    }

    if (registerFormSubmit) {
        registerFormSubmit.addEventListener('submit', handleRegister);
    }

    // Password visibility toggle
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', togglePasswordVisibility);
    });

    // Demo account buttons
    const demoBtns = document.querySelectorAll('.demo-btn');
    demoBtns.forEach(btn => {
        btn.addEventListener('click', fillDemoCredentials);
    });

    // Password validation for register form
    const registerPassword = document.getElementById('registerPassword');
    if (registerPassword) {
        registerPassword.addEventListener('input', validatePassword);
    }

    // Modal close handlers
    const successOk = document.getElementById('success-ok');
    const errorOk = document.getElementById('error-ok');
    
    if (successOk) {
        successOk.addEventListener('click', () => {
            hideModal('success-modal');
        });
    }
    
    if (errorOk) {
        errorOk.addEventListener('click', () => {
            hideModal('error-modal');
        });
    }
}

// Switch to register form
function switchToRegister() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    loginForm.classList.add('sliding-out');
    
    setTimeout(() => {
        loginForm.style.display = 'none';
        loginForm.classList.remove('sliding-out');
        
        registerForm.style.display = 'block';
        registerForm.classList.add('sliding-in');
        
        setTimeout(() => {
            registerForm.classList.remove('sliding-in');
        }, 300);
    }, 300);
}

// Switch to login form
function switchToLogin() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    registerForm.classList.add('sliding-out');
    
    setTimeout(() => {
        registerForm.style.display = 'none';
        registerForm.classList.remove('sliding-out');
        
        loginForm.style.display = 'block';
        loginForm.classList.add('sliding-in');
        
        setTimeout(() => {
            loginForm.classList.remove('sliding-in');
        }, 300);
    }, 300);
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const loginBtn = document.getElementById('loginBtn');
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!username || !password) {
        showErrorModal('Username dan password harus diisi');
        return;
    }

    setButtonLoading(loginBtn, true);

    try {
        // For demo purposes, we'll simulate API call with localStorage
        const loginData = await simulateLogin(username, password);
        
        if (loginData.success) {
            // Store auth data
            if (rememberMe) {
                localStorage.setItem('authToken', loginData.token);
                localStorage.setItem('currentUser', JSON.stringify(loginData.user));
            } else {
                sessionStorage.setItem('authToken', loginData.token);
                sessionStorage.setItem('currentUser', JSON.stringify(loginData.user));
            }

            showSuccessModal('Login Berhasil!', 'Selamat datang kembali di 3D Marketplace!', () => {
                window.location.href = 'index.html';
            });
        } else {
            showErrorModal(loginData.error || 'Login gagal');
        }
    } catch (error) {
        console.error('Login error:', error);
        showErrorModal('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
        setButtonLoading(loginBtn, false);
    }
}

// Handle register form submission
async function handleRegister(e) {
    e.preventDefault();
    
    const registerBtn = document.getElementById('registerBtn');
    const fullName = document.getElementById('registerFullName').value;
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validation
    if (!fullName || !username || !email || !password || !confirmPassword) {
        showErrorModal('Semua field harus diisi');
        return;
    }

    if (password !== confirmPassword) {
        showErrorModal('Password dan konfirmasi password tidak sama');
        return;
    }

    if (password.length < 8) {
        showErrorModal('Password minimal 8 karakter');
        return;
    }

    if (!agreeTerms) {
        showErrorModal('Anda harus menyetujui syarat dan ketentuan');
        return;
    }

    setButtonLoading(registerBtn, true);

    try {
        // For demo purposes, we'll simulate API call
        const registerData = await simulateRegister({
            fullName,
            username,
            email,
            password
        });
        
        if (registerData.success) {
            showSuccessModal('Registrasi Berhasil!', 'Akun berhasil dibuat. Silakan login untuk melanjutkan.', () => {
                // Clear form
                document.getElementById('registerFormSubmit').reset();
                // Switch to login
                switchToLogin();
            });
        } else {
            showErrorModal(registerData.error || 'Registrasi gagal');
        }
    } catch (error) {
        console.error('Register error:', error);
        showErrorModal('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
        setButtonLoading(registerBtn, false);
    }
}

// Simulate login API call (for demo without real backend)
async function simulateLogin(username, password) {
    // Demo users
    const demoUsers = {
        'admin': { password: 'admin123', user: { id: 1, username: 'admin', email: 'admin@3dmarket.com', fullName: 'Administrator', role: 'admin', avatar: '👨‍💼' }},
        'johndoe': { password: 'john123', user: { id: 2, username: 'johndoe', email: 'john@email.com', fullName: 'John Doe', role: 'customer', avatar: '👨' }},
        'sarah': { password: 'sarah123', user: { id: 3, username: 'sarah', email: 'sarah@gmail.com', fullName: 'Sarah Johnson', role: 'customer', avatar: '👩' }},
        'demo': { password: 'demo123', user: { id: 4, username: 'demo', email: 'demo@3dmarket.com', fullName: 'Demo User', role: 'customer', avatar: '🧪' }}
    };

    return new Promise((resolve) => {
        setTimeout(() => {
            const user = demoUsers[username.toLowerCase()];
            if (user && user.password === password) {
                resolve({
                    success: true,
                    token: 'demo-jwt-token-' + Date.now(),
                    user: user.user
                });
            } else {
                resolve({
                    success: false,
                    error: 'Username atau password salah'
                });
            }
        }, 1000); // Simulate network delay
    });
}

// Simulate register API call (for demo)
async function simulateRegister(userData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simple validation
            if (userData.username.length < 3) {
                resolve({
                    success: false,
                    error: 'Username minimal 3 karakter'
                });
                return;
            }

            // Check if user already exists (simple check)
            const existingUsers = ['admin', 'johndoe', 'sarah', 'demo'];
            if (existingUsers.includes(userData.username.toLowerCase())) {
                resolve({
                    success: false,
                    error: 'Username sudah digunakan'
                });
                return;
            }

            resolve({
                success: true,
                user: {
                    id: Date.now(),
                    username: userData.username,
                    email: userData.email,
                    fullName: userData.fullName,
                    role: 'customer'
                }
            });
        }, 1500); // Simulate network delay
    });
}

// Toggle password visibility
function togglePasswordVisibility(e) {
    const button = e.currentTarget;
    const targetId = button.getAttribute('data-target');
    const passwordInput = document.getElementById(targetId);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        button.classList.add('active');
    } else {
        passwordInput.type = 'password';
        button.classList.remove('active');
    }
}

// Fill demo credentials
function fillDemoCredentials(e) {
    const button = e.currentTarget;
    const username = button.getAttribute('data-username');
    const password = button.getAttribute('data-password');
    
    document.getElementById('loginUsername').value = username;
    document.getElementById('loginPassword').value = password;
    
    // Add visual feedback
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Validate password requirements
function validatePassword() {
    const password = document.getElementById('registerPassword').value;
    const requirements = {
        'length-req': password.length >= 8,
        'uppercase-req': /[A-Z]/.test(password),
        'number-req': /\d/.test(password)
    };
    
    Object.keys(requirements).forEach(reqId => {
        const element = document.getElementById(reqId);
        if (element) {
            if (requirements[reqId]) {
                element.classList.add('valid');
            } else {
                element.classList.remove('valid');
            }
        }
    });
}

// Set button loading state
function setButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Show success modal
function showSuccessModal(title, message, onOk) {
    const modal = document.getElementById('success-modal');
    const titleElement = document.getElementById('success-title');
    const messageElement = document.getElementById('success-message');
    const okButton = document.getElementById('success-ok');
    
    if (titleElement) titleElement.textContent = title;
    if (messageElement) messageElement.textContent = message;
    
    modal.style.display = 'block';
    
    // Remove existing event listeners and add new one
    const newOkButton = okButton.cloneNode(true);
    okButton.parentNode.replaceChild(newOkButton, okButton);
    
    newOkButton.addEventListener('click', () => {
        hideModal('success-modal');
        if (onOk) onOk();
    });
}

// Show error modal
function showErrorModal(message) {
    const modal = document.getElementById('error-modal');
    const messageElement = document.getElementById('error-message');
    
    if (messageElement) messageElement.textContent = message;
    modal.style.display = 'block';
}

// Hide modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Check existing authentication
function checkExistingAuth() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    
    if (token && userStr) {
        try {
            currentUser = JSON.parse(userStr);
            // If user is already logged in, redirect to main page
            window.location.href = 'index.html';
        } catch (error) {
            // Invalid stored data, clear it
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('currentUser');
        }
    }
}

// Handle window resize for 3D canvas
window.addEventListener('resize', () => {
    if (authCamera && authRenderer) {
        authCamera.aspect = window.innerWidth / window.innerHeight;
        authCamera.updateProjectionMatrix();
        authRenderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Export authentication functions for use in other scripts
window.AuthSystem = {
    getCurrentUser: () => {
        const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },
    
    getAuthToken: () => {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    },
    
    isAuthenticated: () => {
        return !!(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));
    },
    
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
};

// Auto-logout after token expiry (24 hours)
setInterval(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
        // In a real application, you would decode the JWT token to check expiry
        // For demo purposes, we'll just check if it's older than 24 hours
        const tokenTime = parseInt(token.split('-').pop());
        const currentTime = Date.now();
        const hoursDiff = (currentTime - tokenTime) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            AuthSystem.logout();
        }
    }
}, 60000); // Check every minute
