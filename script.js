// ==========================================
// SCRIPT PRINCIPAL - NIKEL BOUTIQUE
// ==========================================

// ==========================================
// 1. CHARGEMENT DES PRODUITS
// ==========================================

async function loadFeaturedProducts() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) {
        console.log('⚠️ Grid non trouvée sur cette page');
        return;
    }

    // Vérifier que Supabase est disponible
    if (!window.supabaseClient) {
        console.error('❌ Supabase non initialisé');
        grid.innerHTML = `
            <div style="text-align:center;padding:40px;color:red;">
                ❌ Erreur de connexion à la base de données
            </div>`;
        return;
    }

    try {
        console.log('🔄 Chargement des produits depuis Supabase...');
        
        const { data: products, error } = await window.supabaseClient
            .from('produits')
            .select('*')
            .limit(4)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Erreur Supabase:', error);
            showError(grid, error.message);
            return;
        }

        console.log(`📦 ${products?.length || 0} produits trouvés`);

        if (!products || products.length === 0) {
            grid.innerHTML = `
                <div style="text-align:center;padding:40px;color:var(--dark-gray);grid-column:1/-1;">
                    🛒 Aucun produit en vedette pour le moment
                </div>`;
            return;
        }

        // Afficher les produits
        grid.innerHTML = products.map(createProductCard).join('');
        console.log('✅ Produits affichés avec succès !');

    } catch (err) {
        console.error('❌ Erreur:', err);
        showError(grid, 'Erreur de chargement des produits');
    }
}

// ==========================================
// 2. CRÉATION D'UNE CARTE PRODUIT
// ==========================================

function createProductCard(product) {
    const prix = parseFloat(product.prix).toFixed(2);
    const prixOriginal = product.prix_original ? parseFloat(product.prix_original).toFixed(2) : null;
    const promo = product.promo || 0;
    const imageUrl = product.image_url || 'https://via.placeholder.com/300x400/1a1a1a/FFFFFF?text=NIKEL';
    const categorie = product.categorie || 'Collection';

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${imageUrl}" 
                     alt="${product.nom}"
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/300x400/1a1a1a/FFFFFF?text=Image'">
                ${promo > 0 ? `<span class="badge-promo">-${promo}%</span>` : ''}
            </div>
            <div class="product-info">
                <h3>${escapeHtml(product.nom)}</h3>
                <p class="product-category">${escapeHtml(categorie)}</p>
                <div class="product-prices">
                    ${prixOriginal ? `<span class="price-old">${prixOriginal} €</span>` : ''}
                    <span class="price">${prix} €</span>
                </div>
                <a href="produit.html?id=${product.id}" class="btn btn-outline">
                    Voir le produit
                </a>
                <button onclick="addToCart('${product.id}')" class="btn btn-primary" style="width:100%;margin-top:8px;">
                    <i class="fas fa-shopping-bag"></i> Ajouter au panier
                </button>
            </div>
        </div>
    `;
}

// ==========================================
// 3. GESTION DU PANIER
// ==========================================

function addToCart(productId) {
    // Récupérer le panier existant
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Vérifier si le produit existe déjà
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    // Sauvegarder et mettre à jour
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    // Animation feedback
    const badge = document.querySelector('.badge');
    if (badge) {
        badge.style.transform = 'scale(1.5)';
        setTimeout(() => badge.style.transform = 'scale(1)', 300);
    }
}

function updateCartBadge() {
    const badge = document.querySelector('.badge');
    if (!badge) return;
    
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    } catch (e) {
        badge.textContent = '0';
        badge.style.display = 'none';
    }
}

// ==========================================
// 4. RECHERCHE
// ==========================================

function handleSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    const query = input.value.trim();
    if (query.length > 0) {
        window.location.href = `boutique.html?search=${encodeURIComponent(query)}`;
    }
}

// Barre de recherche - validation avec Entrée
document.addEventListener('DOMContentLoaded', function() {
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
// 5. MENU MOBILE
// ==========================================

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav ul');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
}

// ==========================================
// 6. UTILITAIRES
// ==========================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(grid, message) {
    grid.innerHTML = `
        <div style="text-align:center;padding:40px;color:red;grid-column:1/-1;">
            ❌ ${message}
            <br><br>
            <small style="color:var(--dark-gray);">
                Vérifiez que votre table "produits" existe et contient des données
            </small>
        </div>`;
}

// ==========================================
// 7. INITIALISATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 NIKEL - Boutique en ligne');
    console.log('📅 ' + new Date().toLocaleString());
    
    // Charger les produits
    loadFeaturedProducts();
    
    // Mettre à jour le badge du panier
    updateCartBadge();
    
    // Initialiser le menu mobile
    setupMobileMenu();
    
    // Écouter les changements du panier (autres onglets)
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            updateCartBadge();
        }
    });
});

console.log('✅ Script chargé avec succès !');
