// ==========================================
// CHARGEMENT DES PRODUITS DEPUIS SUPABASE
// ==========================================

async function loadFeaturedProducts() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) {
        console.log('⚠️ #featuredGrid non trouvé sur cette page');
        return;
    }

    if (!window.supabaseClient) {
        console.error('❌ Supabase non initialisé !');
        grid.innerHTML = '<p style="text-align:center;color:red;padding:40px;">⚠️ Erreur de connexion</p>';
        return;
    }

    try {
        console.log('🔄 Chargement des produits...');
        
        const { data: products, error } = await window.supabaseClient
            .from('produits')
            .select('*')
            .limit(4)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Erreur Supabase:', error);
            grid.innerHTML = getDemoProducts();
            return;
        }

        console.log('📦 Produits chargés:', products);

        if (!products || products.length === 0) {
            console.log('⚠️ Aucun produit trouvé');
            grid.innerHTML = getDemoProducts();
            return;
        }

        grid.innerHTML = products.map(product => {
            const prixActuel = parseFloat(product.prix).toFixed(2);
            const prixOriginal = product.prix_original ? parseFloat(product.prix_original).toFixed(2) : null;
            const promo = product.promo || 0;

            return `
                <div class="product-card" data-id="${product.id}">
                    <div class="product-image">
                        <img src="${product.image_url || 'https://via.placeholder.com/300x400/1a1a1a/FFFFFF?text=NIKEL'}" 
                             alt="${product.nom}"
                             onerror="this.src='https://via.placeholder.com/300x400/1a1a1a/FFFFFF?text=Image'">
                        ${promo > 0 ? `<span class="badge-promo">-${promo}%</span>` : ''}
                    </div>
                    <div class="product-info">
                        <h3>${product.nom}</h3>
                        <p class="product-category">${product.categorie || 'Collection'}</p>
                        <div class="product-prices">
                            ${prixOriginal ? `<span class="price-old">${prixOriginal} €</span>` : ''}
                            <span class="price">${prixActuel} €</span>
                        </div>
                        <a href="produit.html?id=${product.id}" class="btn btn-outline">Voir le produit</a>
                    </div>
                </div>
            `;
        }).join('');

        console.log('✅ Produits affichés avec succès !');

    } catch (error) {
        console.error('❌ Erreur:', error);
        grid.innerHTML = getDemoProducts();
    }
}

function getDemoProducts() {
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="https://via.placeholder.com/300x400/1a1a1a/FFFFFF?text=NIKEL+1" alt="Produit">
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
                <img src="https://via.placeholder.com/300x400/1a1a1a/FFFFFF?text=NIKEL+2" alt="Produit">
                <span class="badge-promo">-20%</span>
            </div>
            <div class="product-info">
                <h3>NIKEL Sport</h3>
                <p class="product-category">Collection Sport</p>
                <div class="product-prices">
                    <span class="price-old">99,00 €</span>
                    <span class="price">79,20 €</span>
                </div>
                <a href="produit.html" class="btn btn-outline">Voir le produit</a>
            </div>
        </div>
        <div class="product-card">
            <div class="product-image">
                <img src="https://via.placeholder.com/300x400/1a1a1a/FFFFFF?text=NIKEL+3" alt="Produit">
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
                <img src="https://via.placeholder.com/300x400/1a1a1a/FFFFFF?text=NIKEL+4" alt="Produit">
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

function handleSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    const query = input.value.trim();
    if (query.length > 0) {
        window.location.href = `boutique.html?search=${encodeURIComponent(query)}`;
    }
}

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

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 NIKEL - Site initialisé');
    loadFeaturedProducts();
    updateCartBadge();
    setupMobileMenu();
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            updateCartBadge();
        }
    });
});

console.log('✅ Script chargé avec succès !');
