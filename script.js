/**
 * ============================================
 * NIKEL - script.js
 * Version 4.1 - Avec Supabase + WhatsApp Checkout
 * ============================================
 */

// ============================================
// VARIABLES GLOBALES
// ============================================
let products = [];
let cart = JSON.parse(localStorage.getItem('nikel_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('nikel_wishlist')) || [];

// ============================================
// 1. CHARGEMENT DES PRODUITS DEPUIS SUPABASE
// ============================================
async function loadProductsFromSupabase() {
    console.log('🔄 Chargement des produits depuis Supabase...');
    
    if (!window.supabaseClient) {
        console.error('❌ Supabase non initialisé !');
        return false;
    }
    
    try {
        const { data, error } = await window.supabaseClient
            .from('produits')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('❌ Erreur Supabase:', error);
            return false;
        }
        
        if (!data || data.length === 0) {
            console.warn('⚠️ Aucun produit trouvé dans Supabase');
            return false;
        }
        
        products = data.map(p => ({
            id: p.id,
            name: p.nom,
            price: parseFloat(p.prix),
            oldPrice: p.prix_original ? parseFloat(p.prix_original) : null,
            image: p.image_url || 'https://via.placeholder.com/400x400/1a1a1a/FFFFFF?text=NIKEL',
            category: p.categorie || 'non-classé',
            badge: p.promo > 0 ? 'soldes' : null,
            description: p.description || '',
            rating: 4.5 + (Math.random() * 0.5 - 0.25),
            stock: p.stock || 0,
            promo: p.promo || 0
        }));
        
        console.log(`✅ ${products.length} produits chargés depuis Supabase`);
        return true;
        
    } catch (err) {
        console.error('❌ Erreur:', err);
        return false;
    }
}

// ============================================
// 2. MENU MOBILE
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
// 3. RECHERCHE
// ============================================
function handleSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    const query = input.value.trim();
    
    if (query.length > 0) {
        window.location.href = `boutique.html?search=${encodeURIComponent(query)}`;
    } else {
        window.location.href = 'boutique.html';
    }
}

// ============================================
// 4. AFFICHAGE DES PRODUITS
// ============================================
function renderProducts(productsList, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!productsList || productsList.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:60px 20px;">
                <i class="fas fa-search" style="font-size:3rem;color:var(--gray);"></i>
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
        const discountPercent = product.oldPrice && product.oldPrice > product.price 
            ? Math.round((1 - product.price / product.oldPrice) * 100) 
            : 0;
        
        const badgeHtml = product.badge === 'soldes' && discountPercent > 0
            ? `<span class="badge-soldes" style="position:absolute;top:12px;right:12px;background:#e74c3c;color:white;padding:4px 12px;border-radius:20px;font-size:0.8rem;font-weight:bold;">-${discountPercent}%</span>`
            : product.badge === 'new' 
            ? `<span class="badge-new">Nouveau</span>`
            : '';
        
        const oldPriceHtml = product.oldPrice && product.oldPrice > product.price
            ? `<span class="old-price">${product.oldPrice.toFixed(2)} €</span>`
            : '';
        
        return `
            <div class="product-card" data-id="${product.id}" data-category="${product.category}">
                <div class="product-img" style="position:relative;overflow:hidden;height:300px;background:#f5f5f5;border-radius:12px 12px 0 0;">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s;" onerror="this.src='https://picsum.photos/seed/${product.id}/400/400'">
                    ${badgeHtml}
                    <div class="product-actions" style="position:absolute; bottom:12px; right:12px; display:flex; gap:8px; opacity:0; transition:opacity 0.3s;">
                        <button onclick="quickView('${product.id}')" class="btn-quickview" style="background:rgba(255,255,255,0.9); border:none; border-radius:50%; width:40px; height:40px; cursor:pointer; box-shadow:0 2px 12px rgba(0,0,0,0.1);">
                            <i class="fas fa-eye" style="color:var(--primary);"></i>
                        </button>
                        <button onclick="addToWishlist('${product.id}')" class="btn-wishlist" style="background:rgba(255,255,255,0.9); border:none; border-radius:50%; width:40px; height:40px; cursor:pointer; box-shadow:0 2px 12px rgba(0,0,0,0.1);">
                            <i class="fas fa-heart" style="color:var(--primary);"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info" style="padding:16px;">
                    <h3 class="product-name" style="margin:0 0 8px 0;font-size:1.1rem;">${product.name}</h3>
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                        <span style="color:var(--gold); font-size:0.85rem;">${'★'.repeat(Math.floor(product.rating || 4.5))}${(product.rating || 4.5) % 1 >= 0.5 ? '½' : ''}</span>
                        <span style="color:var(--gray); font-size:0.8rem;">(${(product.rating || 4.5).toFixed(1)})</span>
                    </div>
                    <p class="product-price" style="display:flex;gap:10px;align-items:center;margin:8px 0;">
                        <span style="font-size:1.2rem;font-weight:700;color:var(--gold);">${product.price.toFixed(2)} €</span>
                        ${oldPriceHtml}
                    </p>
                    ${product.stock > 0 ? `
                        <button class="btn-add-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" style="background:linear-gradient(135deg, var(--gold), var(--accent-dark));border:none;padding:10px 20px;border-radius:50px;color:white;font-weight:600;cursor:pointer;transition:all 0.3s;width:100%;">
                            <i class="fas fa-plus"></i> Ajouter au panier
                        </button>
                    ` : `
                        <button style="width:100%;background:#e74c3c;border:none;padding:10px 20px;border-radius:50px;color:white;font-weight:600;cursor:not-allowed;">
                            <i class="fas fa-times"></i> Rupture de stock
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('');
    
    container.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            addToCart(id, name, price);
            
            this.innerHTML = '<i class="fas fa-check"></i> Ajouté !';
            this.style.background = 'var(--gold)';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus"></i> Ajouter au panier';
                this.style.background = 'linear-gradient(135deg, var(--gold), var(--accent-dark))';
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
            <div class="empty-state" style="text-align:center;padding:60px 20px;">
                <i class="fas fa-shopping-bag" style="font-size:3rem;color:var(--gray);"></i>
                <h3>Votre panier est vide</h3>
                <p>Découvrez nos produits et faites-vous plaisir !</p>
                <a href="boutique.html" class="btn btn-primary" style="margin-top:16px;display:inline-block;padding:12px 30px;background:var(--gold);color:white;border-radius:50px;text-decoration:none;font-weight:600;">
                    <i class="fas fa-arrow-right"></i> Explorer la boutique
                </a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        const imageUrl = product ? product.image : 'https://picsum.photos/seed/' + item.id + '/100/100';
        
        return `
            <div class="cart-item" data-id="${item.id}" style="display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid var(--light-gray);">
                <img src="${imageUrl}" alt="${item.name}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;" onerror="this.src='https://picsum.photos/seed/${item.id}/100/100'">
                <div class="cart-item-info" style="flex:1;">
                    <h4 style="margin:0 0 4px 0;">${item.name}</h4>
                    <p style="margin:0;font-weight:600;color:var(--gold);">${(item.price * item.quantity).toFixed(2)} €</p>
                    <p style="margin:0;font-size:0.8rem;color:var(--gray);">${item.price.toFixed(2)} € / unité</p>
                </div>
                <div class="cart-item-actions" style="display:flex;align-items:center;gap:8px;">
                    <button onclick="updateQuantity('${item.id}', -1)" style="width:32px;height:32px;border-radius:50%;border:1px solid var(--light-gray);background:transparent;cursor:pointer;">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span style="font-weight:600;min-width:24px;text-align:center;">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)" style="width:32px;height:32px;border-radius:50%;border:1px solid var(--light-gray);background:transparent;cursor:pointer;">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button onclick="removeFromCart('${item.id}')" style="width:32px;height:32px;border-radius:50%;border:1px solid #e74c3c;background:transparent;color:#e74c3c;cursor:pointer;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateTotal() {
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) {
        const total = getCartTotal();
        totalEl.textContent = total.toFixed(2) + ' €';
    }
}

// ============================================
// 7. CHECKOUT (VERSION WHATSAPP AVEC SOUS-TOTAUX)
// ============================================
function renderCheckoutItems() {
    const container = document.getElementById('checkoutItems');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:20px 0; color:var(--gray);">
                <i class="fas fa-shopping-bag" style="font-size:40px; display:block; margin-bottom:10px; color:#ddd;"></i>
                Votre panier est vide
            </div>
        `;
        return;
    }
    
    let html = '';
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        const imageUrl = product ? product.image : 'https://picsum.photos/seed/' + item.id + '/50/50';
        const itemTotal = item.price * item.quantity;
        
        html += `
            <div class="cart-item-checkout" style="display:flex; flex-direction:column; padding:12px 0; border-bottom:1px solid var(--light-gray);">
                <div style="display:flex; align-items:center; gap:12px;">
                    <img src="${imageUrl}" alt="${item.name}" style="width:45px; height:45px; border-radius:8px; object-fit:cover;" onerror="this.src='https://picsum.photos/seed/${item.id}/50/50'">
                    <div style="flex:1; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:600; color:var(--dark-gray);">${item.name}</span>
                        <span style="font-weight:700; color:var(--accent-dark);">${itemTotal.toFixed(2).replace('.', ',')} FCFA</span>
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--gray); margin-top:4px; padding-left:57px;">
                    <span>Prix unitaire : ${item.price.toFixed(2).replace('.', ',')} FCFA</span>
                    <span>Quantité : ${item.quantity}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updateCheckoutTotal() {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('checkoutTotal');
    const deliveryEl = document.getElementById('deliveryCost');
    
    if (!subtotalEl) return;
    
    const subtotal = getCartTotal();
    subtotalEl.textContent = subtotal.toFixed(2).replace('.', ',') + ' FCFA';
    
    let deliveryCost = 0;
    const selectedDelivery = document.querySelector('input[name="livraison"]:checked');
    if (selectedDelivery && selectedDelivery.value === 'express') {
        deliveryCost = 9.90;
    } else if (subtotal < 59) {
        deliveryCost = 5.90;
    }
    
    if (deliveryEl) {
        deliveryEl.textContent = deliveryCost === 0 ? 'Offerte' : deliveryCost.toFixed(2).replace('.', ',') + ' FCFA';
    }
    
    const total = subtotal + deliveryCost;
    if (totalEl) {
        totalEl.textContent = total.toFixed(2).replace('.', ',') + ' FCFA';
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
    
    // Construire le message WhatsApp
    let message = '🛒 *NOUVEL ACHAT* 🛒\n\n';
    message += `👤 *Client :* ${formData.get('prenom')} ${formData.get('nom')}\n`;
    message += `📱 *Téléphone :* ${formData.get('telephone')}\n`;
    message += `📧 *Email :* ${formData.get('email')}\n`;
    message += `📍 *Pays :* ${formData.get('pays')}\n`;
    message += `🏙️ *Ville :* ${formData.get('ville')}\n\n`;
    message += '📦 *Détails de l\'achat :*\n';
    message += '─'.repeat(20) + '\n';
    
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `• ${item.name} x ${item.quantity} = ${itemTotal.toFixed(2).replace('.', ',')} FCFA\n`;
    });
    
    message += '─'.repeat(20) + '\n';
    message += `💰 *Total :* ${total.toFixed(2).replace('.', ',')} FCFA\n\n`;
    message += '📱 Merci de confirmer votre achat !';
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '33612345678'; // À remplacer par votre numéro
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    // Vider le panier après validation
    cart = [];
    updateCart();
    showNotification('✅ Commande envoyée sur WhatsApp !', 'success');
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
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
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
async function initSite() {
    console.log('🚀 NIKEL - Boutique en ligne v4.1 (WhatsApp Checkout)');
    
    // Charger les produits depuis Supabase
    const loaded = await loadProductsFromSupabase();
    
    if (!loaded) {
        console.warn('⚠️ Utilisation de données de secours');
        products = [
            { id: '1', name: 'NIKEL Essential', price: 89.00, oldPrice: null, image: 'https://via.placeholder.com/400x400/1a1a1a/FFFFFF?text=NIKEL', category: 'vêtements', badge: null, description: 'T-shirt premium', rating: 4.5, stock: 25, promo: 0 },
            { id: '2', name: 'NIKEL Sport', price: 79.00, oldPrice: 99.00, image: 'https://via.placeholder.com/400x400/1a1a1a/FFFFFF?text=NIKEL', category: 'sport', badge: 'soldes', description: 'T-shirt technique', rating: 4.7, stock: 15, promo: 20 },
            { id: '3', name: 'NIKEL Luxe', price: 149.00, oldPrice: null, image: 'https://via.placeholder.com/400x400/1a1a1a/FFFFFF?text=NIKEL', category: 'accessoires', badge: null, description: 'Blazer élégant', rating: 4.8, stock: 10, promo: 0 }
        ];
    }
    
    // Page d'accueil
    if (document.getElementById('featuredGrid')) {
        const featured = products.slice(0, 4);
        renderProducts(featured, 'featuredGrid');
    }
    
    // Page boutique
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
                (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
            );
            renderProducts(results, 'shopGrid');
        } else {
            initFilters();
        }
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
    
    console.log(`✅ ${products.length} produits disponibles`);
    console.log(`🛒 ${cart.length} articles dans le panier`);
}

// Lancer l'initialisation
document.addEventListener('DOMContentLoaded', initSite);

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
