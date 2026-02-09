// Admin Panel JavaScript
const ADMIN_PASSWORD = 'KonvyIsKing123';
const STORAGE_KEY = 'astral_products';
const AUTH_KEY = 'astral_admin_auth';
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1470525672756871414/wR6Upu2fD0rs1fjrg1OI0p_EaGyZAgX6U4glkyJwnAtzYrLxd7iziW5x-HCe-ODsNGfF';

// Send Discord notification
async function sendDiscordNotification(action, details = '', color = 0xa855f7) {
    const embed = {
        title: `🎮 ${action}`,
        description: details,
        color: color,
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Astral Cheats Admin Panel'
        }
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [embed]
            })
        });
        
        if (!response.ok) {
            console.error('Discord webhook failed:', response.status);
        }
    } catch (error) {
        console.error('Failed to send Discord notification:', error);
    }
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeDefaultProducts();
});

// Show notification
function showNotification(message, duration = 3000) {
    const toast = document.getElementById('notification-toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Check if user is authenticated
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem(AUTH_KEY) === 'true';
    
    if (isAuthenticated) {
        showAdminPanel();
    } else {
        showLoginScreen();
    }
}

// Show login screen
function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
    
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'flex';
    
    initializeAdminPanel();
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('admin-password').value;
    const errorElement = document.getElementById('login-error');
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, 'true');
        showAdminPanel();
        showNotification('Welcome, Administrator! 👑');
        
        // Send Discord notification for login
        await sendDiscordNotification(
            'Admin Login',
            `🔐 Administrator logged into the panel\n**Time:** ${new Date().toLocaleString()}`,
            0x3b82f6
        );
    } else {
        errorElement.textContent = 'Invalid password. Access denied.';
        setTimeout(() => {
            errorElement.textContent = '';
        }, 3000);
        
        // Send Discord notification for failed login
        await sendDiscordNotification(
            'Failed Login Attempt',
            `⚠️ Someone tried to access the admin panel with incorrect password\n**Time:** ${new Date().toLocaleString()}`,
            0xef4444
        );
    }
}

// Initialize admin panel
function initializeAdminPanel() {
    loadProducts();
    loadStatusPage();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.admin-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            if (tab) {
                e.preventDefault();
                switchTab(tab);
            }
        });
    });
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Send Discord notification for logout
        await sendDiscordNotification(
            'Admin Logout',
            `👋 Administrator logged out of the panel\n**Time:** ${new Date().toLocaleString()}`,
            0x94a3b8
        );
        
        sessionStorage.removeItem(AUTH_KEY);
        location.reload();
    });
    
    // Add product
    document.getElementById('add-product-btn').addEventListener('click', openAddProductModal);
    
    // Modal controls
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-modal').addEventListener('click', closeModal);
    
    // Product form
    document.getElementById('product-form').addEventListener('submit', handleProductSave);
    
    // Add duration button
    document.getElementById('add-duration-btn').addEventListener('click', addDurationField);
}

// Switch tabs
function switchTab(tabName) {
    // Update nav links
    document.querySelectorAll('.admin-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.tab === tabName) {
            link.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Initialize default products
function initializeDefaultProducts() {
    const existingProducts = localStorage.getItem(STORAGE_KEY);
    
    if (!existingProducts) {
        const defaultProducts = [
            {
                id: 1,
                name: 'Fortnite Premium',
                category: 'Fortnite',
                price: 29.99,
                period: '/month',
                features: [
                    'Aimbot with customizable FOV',
                    'ESP & Wallhacks',
                    'No Recoil & No Spread',
                    'Radar & Player Info',
                    'Auto-update system'
                ],
                description: 'Premium Fortnite cheat with advanced features',
                image: '',
                status: 'working',
                durations: [
                    { label: '1 Day', days: 1, price: 4.99 },
                    { label: '1 Week', days: 7, price: 14.99 },
                    { label: '1 Month', days: 30, price: 29.99 },
                    { label: '3 Months', days: 90, price: 74.99 }
                ]
            },
            {
                id: 2,
                name: 'Valorant Elite',
                category: 'Valorant',
                price: 39.99,
                period: '/month',
                features: [
                    'Advanced Triggerbot',
                    'Bone Aimbot (Head/Body)',
                    'Agent ESP & Abilities',
                    'Recoil Control System',
                    'Stream-proof mode'
                ],
                description: 'Top-tier Valorant cheat for competitive play',
                image: '',
                status: 'working',
                durations: [
                    { label: '1 Day', days: 1, price: 5.99 },
                    { label: '1 Week', days: 7, price: 19.99 },
                    { label: '1 Month', days: 30, price: 39.99 },
                    { label: '3 Months', days: 90, price: 99.99 }
                ]
            },
            {
                id: 3,
                name: 'Apex Legends Pro',
                category: 'Apex Legends',
                price: 34.99,
                period: '/month',
                features: [
                    'Smart Aimbot with prediction',
                    'Legend ESP & Health bars',
                    'Loot ESP with filters',
                    'Glow effects',
                    'Speed hack & fly mode'
                ],
                description: 'Advanced Apex Legends cheat suite',
                image: '',
                status: 'working',
                durations: [
                    { label: '1 Day', days: 1, price: 4.99 },
                    { label: '1 Week', days: 7, price: 17.49 },
                    { label: '1 Month', days: 30, price: 34.99 },
                    { label: '3 Months', days: 90, price: 84.99 }
                ]
            }
        ];
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    }
}

// Get all products
function getProducts() {
    const products = localStorage.getItem(STORAGE_KEY);
    return products ? JSON.parse(products) : [];
}

// Save products
function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Load products into admin panel
function loadProducts() {
    const products = getProducts();
    const container = document.getElementById('products-list');
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No products yet. Add your first product!</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-item">
            <div class="product-status-indicator status-${product.status}">
                ${getStatusIcon(product.status)}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-meta">
                    <span class="product-price">$${product.price}${product.period}</span>
                    <span class="product-status-text status-${product.status}">${getStatusLabel(product.status)}</span>
                    ${product.category ? `<span style="color: var(--text-muted); font-size: 0.9rem;">📁 ${product.category}</span>` : ''}
                </div>
                <p class="product-features-preview">${product.features.length} features • ${product.durations.length} pricing options</p>
            </div>
            <div class="product-actions">
                <button class="btn btn-small btn-edit" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-small btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Load status page
function loadStatusPage() {
    const products = getProducts();
    const container = document.getElementById('status-list');
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No products yet. Add products to manage their status.</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="status-item">
            <div class="status-header">
                <div>
                    <h3>${product.name}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
                        ${product.category || 'No category'} • Current: <span class="product-status-text status-${product.status}">${getStatusLabel(product.status)}</span>
                    </p>
                </div>
                <div class="status-controls">
                    <button class="status-btn status-btn-working ${product.status === 'working' ? 'active' : ''}" 
                            onclick="updateProductStatus(${product.id}, 'working')">
                        ✓ Working
                    </button>
                    <button class="status-btn status-btn-caution ${product.status === 'caution' ? 'active' : ''}" 
                            onclick="updateProductStatus(${product.id}, 'caution')">
                        ⚠ Caution
                    </button>
                    <button class="status-btn status-btn-updating ${product.status === 'updating' ? 'active' : ''}" 
                            onclick="updateProductStatus(${product.id}, 'updating')">
                        🔄 Updating
                    </button>
                    <button class="status-btn status-btn-offline ${product.status === 'offline' ? 'active' : ''}" 
                            onclick="updateProductStatus(${product.id}, 'offline')">
                        ✗ Offline
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Get status icon
function getStatusIcon(status) {
    const icons = {
        working: '✓',
        caution: '⚠',
        updating: '🔄',
        offline: '✗'
    };
    return icons[status] || '?';
}

// Get status label
function getStatusLabel(status) {
    const labels = {
        working: 'Working',
        caution: 'Use at Own Risk',
        updating: 'Updating',
        offline: 'Offline'
    };
    return labels[status] || 'Unknown';
}

// Update product status
async function updateProductStatus(productId, newStatus) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const oldStatus = product.status;
        product.status = newStatus;
        saveProducts(products);
        loadProducts();
        loadStatusPage();
        showNotification(`Status updated: ${product.name} is now ${getStatusLabel(newStatus)}`);
        
        // Send Discord notification
        const statusColors = {
            working: 0x22c55e,
            caution: 0xf97316,
            updating: 0x3b82f6,
            offline: 0xef4444
        };
        
        await sendDiscordNotification(
            'Status Updated',
            `**Product:** ${product.name}\n**Old Status:** ${getStatusLabel(oldStatus)}\n**New Status:** ${getStatusLabel(newStatus)}\n**Category:** ${product.category || 'N/A'}`,
            statusColors[newStatus] || 0xa855f7
        );
    }
}

// Open add product modal
function openAddProductModal() {
    document.getElementById('modal-title').textContent = 'Add New Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    loadDurations([]);
    loadCategorySuggestions();
    document.getElementById('product-modal').classList.add('show');
}

// Edit product
function editProduct(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        document.getElementById('modal-title').textContent = 'Edit Product';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category || '';
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-period').value = product.period;
        document.getElementById('product-features').value = product.features.join('\n');
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-image').value = product.image || '';
        
        // Load durations
        loadDurations(product.durations || []);
        
        // Load category suggestions
        loadCategorySuggestions();
        
        document.getElementById('product-modal').classList.add('show');
    }
}

// Load category suggestions
function loadCategorySuggestions() {
    const products = getProducts();
    const categories = [...new Set(products.map(p => p.category).filter(c => c))];
    const datalist = document.getElementById('category-suggestions');
    
    datalist.innerHTML = categories.map(cat => `<option value="${cat}">`).join('');
}

// Load durations into form
function loadDurations(durations) {
    const container = document.getElementById('durations-list');
    container.innerHTML = '';
    
    if (durations.length === 0) {
        // Add default durations
        durations = [
            { label: '1 Day', days: 1, price: 4.99 },
            { label: '1 Week', days: 7, price: 14.99 },
            { label: '1 Month', days: 30, price: 29.99 },
            { label: '3 Months', days: 90, price: 74.99 }
        ];
    }
    
    durations.forEach((duration, index) => {
        addDurationField(duration, index);
    });
}

// Add duration field
function addDurationField(duration = null, index = null) {
    const container = document.getElementById('durations-list');
    const durationIndex = index !== null ? index : container.children.length;
    
    const durationDiv = document.createElement('div');
    durationDiv.className = 'duration-field';
    durationDiv.innerHTML = `
        <div class="duration-field-row">
            <input type="text" 
                   class="duration-label-input" 
                   placeholder="Label (e.g., 1 Month)" 
                   value="${duration ? duration.label : ''}"
                   required>
            <input type="number" 
                   class="duration-days-input" 
                   placeholder="Days" 
                   value="${duration ? duration.days : ''}"
                   min="1"
                   required>
            <input type="number" 
                   class="duration-price-input" 
                   placeholder="Price" 
                   value="${duration ? duration.price : ''}"
                   step="0.01"
                   min="0"
                   required>
            <button type="button" class="btn-remove-duration" onclick="removeDurationField(this)">×</button>
        </div>
    `;
    
    container.appendChild(durationDiv);
}

// Remove duration field
function removeDurationField(button) {
    const durationField = button.closest('.duration-field');
    durationField.remove();
}

// Get durations from form
function getDurationsFromForm() {
    const durations = [];
    const durationFields = document.querySelectorAll('.duration-field');
    
    durationFields.forEach(field => {
        const label = field.querySelector('.duration-label-input').value;
        const days = parseInt(field.querySelector('.duration-days-input').value);
        const price = parseFloat(field.querySelector('.duration-price-input').value);
        
        if (label && days && price >= 0) {
            durations.push({ label, days, price });
        }
    });
    
    return durations;
}

// Delete product
async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = getProducts();
        const product = products.find(p => p.id === productId);
        const productName = product ? product.name : 'Unknown';
        const productCategory = product ? product.category : 'N/A';
        
        products = products.filter(p => p.id !== productId);
        saveProducts(products);
        loadProducts();
        loadStatusPage();
        showNotification('Product deleted successfully');
        
        // Send Discord notification
        await sendDiscordNotification(
            'Product Deleted',
            `❌ **Product:** ${productName}\n**Category:** ${productCategory}\n**Action:** Removed from store`,
            0xef4444
        );
    }
}

// Close modal
function closeModal() {
    document.getElementById('product-modal').classList.remove('show');
}

// Handle product save
async function handleProductSave(e) {
    e.preventDefault();
    
    const productId = document.getElementById('product-id').value;
    const products = getProducts();
    const isNewProduct = !productId;
    
    const productData = {
        id: productId ? parseInt(productId) : Date.now(),
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        period: document.getElementById('product-period').value,
        features: document.getElementById('product-features').value.split('\n').filter(f => f.trim()),
        description: document.getElementById('product-description').value,
        image: document.getElementById('product-image').value,
        status: isNewProduct ? 'working' : (products.find(p => p.id === parseInt(productId))?.status || 'working'),
        durations: getDurationsFromForm()
    };
    
    if (productId) {
        // Update existing product
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = productData;
        }
    } else {
        // Add new product
        products.push(productData);
    }
    
    saveProducts(products);
    loadProducts();
    loadStatusPage();
    closeModal();
    showNotification(isNewProduct ? 'Product added successfully' : 'Product updated successfully');
    
    // Send Discord notification
    const action = isNewProduct ? 'Product Added' : 'Product Updated';
    const actionColor = isNewProduct ? 0x22c55e : 0xa855f7;
    const actionIcon = isNewProduct ? '✅' : '📝';
    
    await sendDiscordNotification(
        action,
        `${actionIcon} **Product:** ${productData.name}\n**Category:** ${productData.category}\n**Price:** $${productData.price}${productData.period}\n**Status:** ${getStatusLabel(productData.status)}\n**Features:** ${productData.features.length}\n**Pricing Options:** ${productData.durations.length}`,
        actionColor
    );
}

// Make functions globally accessible
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.updateProductStatus = updateProductStatus;
window.removeDurationField = removeDurationField;
