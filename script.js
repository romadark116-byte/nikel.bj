/**
 * ============================================
 * NIKEL - script.js
 * Version 3.0 - Avec barre de recherche
 * ============================================
 */

// ============================================
// 1. MENU MOBILE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('open');
            
            const icon = this.querySelector('i');
            if (nav.classList.contains('open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('open');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    }
});

// ============================================
// 2. CATALOGUE PRODUITS
// ============================================
const products = [
    { 
        id: 1, 
        name: 'Baskets AERO', 
        price: 89.00, 
        oldPrice: 112.00, 
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        category: 'chaussures', 
        badge: 'soldes',
        description: 'Baskets en cuir pleine fleur, semelle en caoutchouc naturel.',
        rating: 4.8
    },
    { 
        id: 2, 
        name: 'Sac NOMAD', 
        price: 59.00, 
        oldPrice: null, 
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
        category: 'accessoires', 
        badge: 'new',
        description: 'Sac en toile enduite, bandoulière ajustable.',
        rating: 4.9
    },
    { 
        id: 3, 
        name: 'Montre EDGE', 
        price: 149.00, 
        oldPrice: null, 
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        category: 'accessoires', 
        badge: null,
        description: 'Montre automatique, mouvement suisse, bracelet en acier.',
        rating: 4.7
    },
    { 
        id: 4, 
        name: 'T-shirt ESSENTIAL', 
        price: 39.00, 
        oldPrice: 49.00, 
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        category: 'vêtements', 
        badge: 'soldes',
        description: 'T-shirt en coton bio, coupe classique.',
        rating: 4.5
    },
    { 
        id: 5, 
        name: 'Casquette URBAN', 
        price: 29.00, 
        oldPrice: null, 
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
        category: 'accessoires', 
        badge: null,
        description: 'Casquette en coton, fermeture ajustable.',
        rating: 4.3
    },
    { 
        id: 6, 
        name: 'Pantalon CARGO', 
        price: 79.00, 
        oldPrice: null, 
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
        category: 'vêtements', 
        badge: 'new',
        description: 'Pantalon cargo en coton, multiples poches.',
        rating: 4.6
    },
    { 
        id: 7, 
        name: 'Lunettes NOIR', 
        price: 120.00, 
        oldPrice: 160.00, 
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        category: 'accessoires', 
        badge: 'soldes',
        description: 'Lunettes de soleil, monture en acétate, verres polarisés.',
        rating: 4.7
    },
    { 
        id: 8, 
        name: 'Veste BOMBER', 
        price: 159.00, 
        oldPrice: null, 
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
        category: 'vêtements', 
        badge: null,
        description: 'Veste bomber en nylon, doublure chaude.',
        rating: 4.8
    }
];

// ============================================
// 3. RECHERCHE
// ============================================
function handleSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    const query = input.value.trim();
    
    // Rediriger vers la page boutique avec la recherche
    if (query.length > 0) {
        window.location.href = `boutique.html?search=${encodeURIComponent(query)}`;
    } else {
        window.location.href = 'boutique.html';
    }
}

// Recherche sur la page boutique
function initSearchFromURL() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search');
    
    if (query) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = query;
        }
        // Appliquer la recherche
        const results = products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        );
        renderProducts(results, 'shopGrid');
    }
}

// Recherche en temps réel (optionnelle)
function liveSearch() {
    const input = document.getElementById('liveSearch');
    if (!input) return;
    
    const query = input.value.trim();
    if (query.length === 0) {
        renderProducts(products, 'shopGrid');
        return;
    }
    
    const results = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(results, 'shopGrid');
}

// ============================================
// 4. AFFICHAGE DES PRODUITS
// ============================================
function renderProducts(productsList, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!productsList || productsList.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <i class="fas fa-search"></i>
                <h3>Aucun produit trouvé</h3>
                <p>Essayez de modifier vos filtres ou votre recherche.</p>
                <a href="boutique.html" class="btn btn-primary" style="margin-top:16px;">
                    <i class="fas fa-arrow-left"></i> Voir tous les produits
                </a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = productsList.map(product => {
        const badgeHtml = product.badge === 'soldes' 
            ? `<span class="badge-soldes">-${Math.round((1 - product.price / product.oldPrice) * 100)}%</span>`
            : product.badge === 'new' 
            ? `<span class="badge-new">Nouveau</span>`
            : '';
        
        const oldPriceHtml = product.oldPrice 
            ? `<span class="old-price">${product.oldPrice.toFixed(2)} €</span>`
            : '';
        
        return `
            <div class="product-card" data-id="${product.id}" data-category="${product.category}">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://picsum.photos/seed/${product.id}/400/400'">
                    ${badgeHtml}
                    <div class="product-actions" style="position:absolute; bottom:12px; right:12px; display:flex; gap:8px; opacity:0; transition:opacity 0.3s;">
                        <button onclick="quickView(${product.id})" class="btn-quickview" style="background:rgba(255,255,255,0.9); border:none; border-radius:50%; width:40px; height:40px; cursor:pointer; box-shadow:0 2px 12px rgba(0,0,0,0.1);">
                            <i class="fas fa-eye" style="color:var(--primary);"></i>
                        </button>
                        <button onclick="addToWishlist(${product.id})" class="btn-wishlist" style="background:rgba(255,255,255,0.9); border:none; border-radius:50%; width:40px; height:40px; cursor:pointer; box-shadow:0 2px 12px rgba(0,0,0,0.1);">
                            <i class="fas fa-heart" style="color:var(--primary);"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                        <span style="color:var(--gold); font-size:0.85rem;">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 >= 0.5 ? '½' : ''}</span>
                        <span style="color:var(--gray); font-size:0.8rem;">(${product.rating})</span>
                    </div>
                    <p class="product-price">
                        ${product.price.toFixed(2)} €
                        ${oldPriceHtml}
                    </p>
                    <button class="btn-add-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                        <i class="fas fa-plus"></i> Ajouter au panier
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    container.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            addToCart(id, name, price);
            
            this.innerHTML = '<i class="fas fa-check"></i> Ajouté !';
            this.style.background = 'var(--gold)';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus"></i> Ajouter au panier';
                this.style.background = '';
            }, 1500);
        });
    });
    
    container.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const actions = this.querySelector('.product-actions');
            if (actions) actions.style.opacity = '1';
        });
        card.addEventListener('mouseleave', function() {
            const actions = this.querySelector('.product-actions');
            if (actions) actions.style.opacity = '0';
        });
    });
}

// ============================================
// 5. GESTION DU PANIER
// ============================================
let cart = JSON.parse(localStorage.getItem('nikel_cart')) || [];

function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCart();
    showNotification(`${name} ajouté au panier ! 🛒`, 'success');
}

function removeFromCart(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
        showNotification(`${item.name} retiré du panier`, 'info');
    }
}

function updateQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
}

function clearCart() {
    if (cart.length === 0) return;
    cart = [];
    updateCart();
    showNotification('Panier vidé', 'info');
}

function updateCart() {
    localStorage.setItem('nikel_cart', JSON.stringify(cart));
    updateBadge();
    renderCartItems();
    updateTotal();
    updateCheckoutTotal();
}

function updateBadge() {
    const badges = document.querySelectorAll('.badge');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    badges.forEach(badge => {
        badge.textContent = total;
    });
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// ============================================
// 6. AFFICHAGE DU PANIER
// ============================================
function renderCartItems() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>Votre panier est vide</h3>
                <p>Découvrez nos produits et faites-vous plaisir !</p>
                <a href="boutique.html" class="btn btn-primary" style="margin-top:16px;">
                    <i class="fas fa-arrow-right"></i> Explorer la boutique
                </a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" alt="${item.name}" onerror="this.src='https://picsum.photos/seed/${item.id}/100/100'">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${(item.price * item.quantity).toFixed(2)} €</p>
                <p style="font-size:0.8rem; color:var(--gray);">${item.price.toFixed(2)} € / unité</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateQuantity(${item.id}, -1)" aria-label="Diminuer la quantité">
                    <i class="fas fa-minus"></i>
                </button>
                <span style="font-weight:600; min-width:24px; text-align:center;">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" aria-label="Augmenter la quantité">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})" aria-label="Supprimer l'article">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateTotal() {
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) {
        const total = getCartTotal();
        totalEl.textContent = total.toFixed(2) + ' €';
    }
}

// ============================================
// 7. CHECKOUT
// ============================================
function renderCheckoutItems() {
    const container = document.getElementById('checkoutItems');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="color:var(--gray); text-align:center; padding:20px;">Votre panier est vide</p>';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div style="display:flex; align-items:center; gap:16px; padding:12px 0; border-bottom:1px solid var(--light-gray);">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop" alt="${item.name}" style="width:50px; height:50px; border-radius:8px; object-fit:cover;" onerror="this.src='https://picsum.photos/seed/${item.id}/50/50'">
            <div style="flex:1;">
                <p style="font-weight:600; font-size:0.95rem;">${item.name}</p>
                <p style="font-size:0.85rem; color:var(--gray);">Quantité : ${item.quantity}</p>
            </div>
            <span style="font-weight:700; color:var(--accent-dark);">${(item.price * item.quantity).toFixed(2)} €</span>
        </div>
    `).join('');
}

function updateCheckoutTotal() {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('checkoutTotal');
    const deliveryEl = document.getElementById('deliveryCost');
    
    if (!subtotalEl) return;
    
    const subtotal = getCartTotal();
    subtotalEl.textContent = subtotal.toFixed(2) + ' €';
    
    let deliveryCost = 0;
    const selectedDelivery = document.querySelector('input[name="livraison"]:checked');
    if (selectedDelivery && selectedDelivery.value === 'express') {
        deliveryCost = 9.90;
    } else if (subtotal < 59) {
        deliveryCost = 5.90;
    }
    
    if (deliveryEl) {
        deliveryEl.textContent = deliveryCost === 0 ? 'Offerte' : deliveryCost.toFixed(2) + ' €';
    }
    
    const total = subtotal + deliveryCost;
    if (totalEl) {
        totalEl.textContent = total.toFixed(2) + ' €';
    }
}

function confirmOrder() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    if (cart.length === 0) {
        showNotification('❌ Votre panier est vide !', 'error');
        return;
    }
    
    const formData = new FormData(form);
    const orderData = {
        firstName: formData.get('prenom'),
        lastName: formData.get('nom'),
        email: formData.get('email'),
        phone: formData.get('telephone'),
        address: formData.get('adresse'),
        postalCode: formData.get('code_postal'),
        city: formData.get('ville'),
        country: formData.get('pays'),
        items: [...cart],
        total: getCartTotal(),
        orderNumber: 'NIK-' + Date.now().toString().slice(-8)
    };
    
    localStorage.setItem('nikel_last_order', JSON.stringify(orderData));
    cart = [];
    updateCart();
    
    showNotification('✅ Commande validée ! Merci pour votre achat.', 'success');
    setTimeout(() => {
        window.location.href = 'confirmation.html';
    }, 1500);
}

// ============================================
// 8. PAGE CONFIRMATION
// ============================================
function renderConfirmation() {
    const container = document.getElementById('confirmationItems');
    if (!container) return;
    
    const order = JSON.parse(localStorage.getItem('nikel_last_order'));
    if (!order) {
        container.innerHTML = '<p>Aucune commande trouvée.</p>';
        return;
    }
    
    container.innerHTML = order.items.map(item => `
        <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--light-gray);">
            <span>${item.name} × ${item.quantity}</span>
            <span style="font-weight:600;">${(item.price * item.quantity).toFixed(2)} €</span>
        </div>
    `).join('');
    
    const totalHtml = `
        <div style="display:flex; justify-content:space-between; padding:12px 0; font-size:1.1rem; font-weight:700; border-top:2px solid var(--gold);">
            <span>Total</span>
            <span style="color:var(--accent-dark);">${order.total.toFixed(2)} €</span>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', totalHtml);
}

// ============================================
// 9. FILTRES ET TRI
// ============================================
function initFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (!categoryFilter || !sortFilter) return;
    
    function filterAndSort() {
        let filtered = [...products];
        const category = categoryFilter.value;
        const sort = sortFilter.value;
        
        if (category !== 'all') {
            filtered = filtered.filter(p => p.category === category);
        }
        
        if (sort === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sort === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        }
        
        renderProducts(filtered, 'shopGrid');
    }
    
    categoryFilter.addEventListener('change', filterAndSort);
    sortFilter.addEventListener('change', filterAndSort);
    filterAndSort();
}

// ============================================
// 10. WISHLIST
// ============================================
let wishlist = JSON.parse(localStorage.getItem('nikel_wishlist')) || [];

function addToWishlist(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    if (wishlist.some(item => item.id === id)) {
        wishlist = wishlist.filter(item => item.id !== id);
        showNotification(`${product.name} retiré de vos favoris 💔`, 'info');
    } else {
        wishlist.push(product);
        showNotification(`${product.name} ajouté à vos favoris ❤️`, 'success');
    }
    
    localStorage.setItem('nikel_wishlist', JSON.stringify(wishlist));
}

// ============================================
// 11. QUICK VIEW
// ============================================
function quickView(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    showNotification(`👀 ${product.name} - ${product.price.toFixed(2)} €`, 'info');
}

// ============================================
// 12. FAQ ACCORDÉON
// ============================================
function initFaq() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('active');
            });
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ============================================
// 13. FORMULAIRES
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('✅ Message envoyé ! Nous vous répondrons sous 24h.', 'success');
        this.reset();
    });
}

function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('🔐 Connexion réussie ! Bienvenue.', 'success');
        setTimeout(() => {
            window.location.href = 'mon-compte.html';
        }, 1000);
    });
}

function initRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = this.querySelector('input[type="password"]');
        const confirm = this.querySelector('input[type="password"]:last-of-type');
        
        if (password.value !== confirm.value) {
            showNotification('❌ Les mots de passe ne correspondent pas.', 'error');
            return;
        }
        
        showNotification('✅ Inscription réussie ! Bienvenue chez NIKEL.', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    });
}

// ============================================
// 14. NOTIFICATIONS (TOAST)
// ============================================
function showNotification(message, type = 'info') {
    const colors = {
        success: 'var(--gold)',
        error: '#e74c3c',
        info: 'var(--primary)'
    };
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--primary);
        color: white;
        padding: 16px 24px;
        border-radius: 14px;
        font-weight: 500;
        box-shadow: 0 8px 40px rgba(0,0,0,0.25);
        z-index: 9999;
        animation: slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        max-width: 400px;
        border-left: 4px solid ${colors[type] || colors.info};
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    toast.innerHTML = `
        <span style="font-size:1.2rem;">
            ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ============================================
// 15. INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 NIKEL - Boutique en ligne v3.0');
    
    // Recherche sur la page boutique (depuis l'URL)
    if (document.getElementById('shopGrid')) {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('search');
        if (query) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = query;
            }
            const results = products.filter(p => 
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase()) ||
                p.description.toLowerCase().includes(query.toLowerCase())
            );
            renderProducts(results, 'shopGrid');
        } else {
            initFilters();
        }
    }
    
    // Page d'accueil
    if (document.getElementById('featuredGrid')) {
        renderProducts(products.slice(0, 3), 'featuredGrid');
    }
    
    // Page panier
    if (document.getElementById('cartItems')) {
        renderCartItems();
        updateTotal();
    }
    
    // Page checkout
    if (document.getElementById('checkoutItems')) {
        renderCheckoutItems();
        updateCheckoutTotal();
        
        document.querySelectorAll('input[name="livraison"]').forEach(radio => {
            radio.addEventListener('change', updateCheckoutTotal);
        });
        
        const confirmBtn = document.getElementById('confirmOrderBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', confirmOrder);
        }
    }
    
    // Page confirmation
    if (document.getElementById('confirmationItems')) {
        renderConfirmation();
    }
    
    // FAQ
    initFaq();
    
    // Formulaires
    initContactForm();
    initLoginForm();
    initRegisterForm();
    
    // Mettre à jour le badge
    updateBadge();
    
    // Recherche avec la touche Entrée
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});
// ==========================================
// CONFIGURATION SUPABASE
// ==========================================
// Ces variables seront définies dans le HTML
// On les récupère depuis le scope global
const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_ANON_KEY;
const supabaseClient = supabase;

// ==========================================
// CHARGEMENT DES PRODUITS (version corrigée)
// ==========================================
async function loadFeaturedProducts() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;

    try {
        const { data: products, error } = await supabaseClient
            .from('produits')
            .select('*')
            .limit(4)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erreur:', error);
            grid.innerHTML = getDemoProducts();
            return;
        }

        if (!products || products.length === 0) {
            grid.innerHTML = getDemoProducts();
            return;
        }

        grid.innerHTML = products.map(product => {
            // Calculer le prix actuel (si promo)
            const prixActuel = product.promo > 0 ? 
                product.prix : 
                product.prix;

            const prixOriginal = product.promo > 0 ? 
                product.prix_original : 
                null;

            return `
                <div class="product-card" data-id="${product.id}">
                    <div class="product-image">
                        <img src="${product.image_url || 'https://via.placeholder.com/300x400'}" alt="${product.nom}">
                        ${product.promo > 0 ? `<span class="badge-promo">-${product.promo}%</span>` : ''}
                    </div>
                    <div class="product-info">
                        <h3>${product.nom}</h3>
                        <p class="product-category">${product.categorie || 'Collection'}</p>
                        <div class="product-prices">
                            ${prixOriginal ? 
                                `<span class="price-old">${prixOriginal} €</span>` : 
                                ''
                            }
                            <span class="price">${prixActuel} €</span>
                        </div>
                        <a href="produit.html?id=${product.id}" class="btn btn-outline">Voir le produit</a>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Erreur:', error);
        grid.innerHTML = getDemoProducts();
    }
}

// ==========================================
// PRODUITS DE DÉMONSTRATION (si Supabase est vide)
// ==========================================
function getDemoProducts() {
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="https://via.placeholder.com/300x400/1a1a1a/FFFFFF?text=Produit+1" alt="Produit">
            </div>
            <div class="product-info">
                <h3>NIKEL Essential</h3>
                <p class="product-category">Collection Premium</p>
                <div class="product-prices">
                    <span class="price">89,00 €</span>
                </div>
                <a href="produit.html" class="btn btn-outline">Voir le produit</a>
            </div>
        </div>
        <div class="product-card">
            <div class="product-image">
                <img src="https://via.placeholder.com/300x400/1a1a1a/FFFFFF?text=Produit+2" alt="Produit">
                <span class="badge-promo">-20%</span>
            </div>
            <div class="product-info">
                <h3>NIKEL Sport</h3>
                <p class="product-category">Collection Sport</p>
                <div class="product-prices">
                    <span class="price-old">79,00 €</span>
                    <span class="price">63,20 €</span>
                </div>
                <a href="produit.html" class="btn btn-outline">Voir le produit</a>
            </div>
        </div>
        <div class="product-card">
            <div class="product-image">
                <img src="https://via.placeholder.com/300x400/1a1a1a/FFFFFF?text=Produit+3" alt="Produit">
            </div>
            <div class="product-info">
                <h3>NIKEL Urban</h3>
                <p class="product-category">Collection Urban</p>
                <div class="product-prices">
                    <span class="price">99,00 €</span>
                </div>
                <a href="produit.html" class="btn btn-outline">Voir le produit</a>
            </div>
        </div>
        <div class="product-card">
            <div class="product-image">
                <img src="https://via.placeholder.com/300x400/1a1a1a/FFFFFF?text=Produit+4" alt="Produit">
            </div>
            <div class="product-info">
                <h3>NIKEL Luxe</h3>
                <p class="product-category">Collection Luxe</p>
                <div class="product-prices">
                    <span class="price">149,00 €</span>
                </div>
                <a href="produit.html" class="btn btn-outline">Voir le produit</a>
            </div>
        </div>
    `;
}

// ==========================================
// GESTION DU PANIER
// ==========================================
function updateCartBadge() {
    const badge = document.querySelector('.badge');
    if (!badge) return;
    
    // Récupérer le panier depuis localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = total;
    
    // Cacher le badge si panier vide
    badge.style.display = total > 0 ? 'flex' : 'none';
}

// ==========================================
// RECHERCHE
// ==========================================
function handleSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    const query = input.value.trim();
    if (query.length > 0) {
        // Rediriger vers la boutique avec la recherche
        window.location.href = `boutique.html?search=${encodeURIComponent(query)}`;
    }
}

// ==========================================
// INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Charger les produits vedettes
    loadFeaturedProducts();
    
    // Mettre à jour le badge du panier
    updateCartBadge();
    
    // Écouter les changements du panier (pour mise à jour en temps réel)
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            updateCartBadge();
        }
    });
    
    // Menu mobile
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const nav = document.querySelector('.nav');
            if (nav) {
                nav.classList.toggle('active');
            }
        });
    }
});

// ============================================
// 16. EXPOSER LES FONCTIONS GLOBALEMENT
// ============================================
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.addToWishlist = addToWishlist;
window.quickView = quickView;
window.handleSearch = handleSearch;
window.confirmOrder = confirmOrder;
window.showNotification = showNotification;

console.log('✅ script.js chargé avec succès !');
console.log(`📦 ${products.length} produits disponibles`);
console.log(`🛒 ${cart.length} articles dans le panier`);
