// Global state for filtering
let filteredProducts = [];
let cart_shop  = JSON.parse(localStorage.getItem('phoneHubCart')) || [];

// ---------------- INIT ----------------
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure products-data.js is fully parsed into window.products
    setTimeout(() => {
        if (window.products) {
            filteredProducts = [...window.products];
            renderProducts(filteredProducts);
            updateCartBadge();
        } else {
            console.error("Product data not found! Check products-data.js");
        }
    }, 100);
});

// ---------------- RENDER ----------------
// ---------------- RENDER ----------------
function renderProducts(list) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!list || list.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center text-secondary my-5">
                <i class="bi bi-search fs-1 d-block mb-3"></i>
                <p>No products match your filters.</p>
                <button class="btn btn-outline-cyan btn-sm" onclick="location.reload()">Reset All</button>
            </div>`;
        return;
    }

    list.forEach(product => {
        const img = product.images ? product.images[0] : 'https://picsum.photos/400';
        
        const col = document.createElement('div');
        col.className = 'col-6 col-lg-4 mb-4';
        col.innerHTML = `
            <div class="card card-neon h-100 border-0 shadow-sm overflow-hidden">
                <div class="position-relative">
                    <a href="product-detail.html?id=${product.id}">
                        <img src="${img}" 
                             class="card-img-top p-3" 
                             alt="${product.name}" 
                             style="aspect-ratio: 1/1; object-fit: contain; cursor: pointer; transition: transform 0.3s ease;">
                    </a>
                    
                    <div class="position-absolute top-0 end-0 m-2">
                        <span class="badge bg-dark-glass text-cyan border border-cyan-50">${product.rating} <i class="bi bi-star-fill"></i></span>
                    </div>
                </div>
                <div class="card-body d-flex flex-column p-3">
                    <small class="text-cyan fw-bold text-uppercase" style="font-size: 10px; letter-spacing: 1px;">${product.brand}</small>
                    
                    <h6 class="card-title fw-bold mb-1 text-truncate">
                        <a href="product-detail.html?id=${product.id}" class="text-decoration-none text-white">
                            ${product.name}
                        </a>
                    </h6>
                    
                    <p class="text-cyan fw-bold mb-3">$${product.price.toLocaleString()}</p>
                    
                    <div class="mt-auto d-grid gap-2">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline-light btn-sm rounded-pill">View Details</a>
                                            <button onclick="event.stopPropagation(); addToCart(${product.id})" 
                            class="btn btn-light w-100 py-2 rounded-pill">
                        Add to Cart
                    </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(col);
    });
}

// ---------------- FILTER LOGIC ----------------
function applyFilters() {
    // 1. Get all checked brands
    const selectedBrands = Array.from(document.querySelectorAll('.filter-brand:checked'))
        .map(cb => cb.value.toLowerCase());

    // 2. Get all checked storages
    const selectedStorages = Array.from(document.querySelectorAll('.filter-storage:checked'))
        .map(cb => cb.value); // e.g., ["128GB", "256GB"]

    // 3. Get all checked RAM
    const selectedRams = Array.from(document.querySelectorAll('.filter-ram:checked'))
        .map(cb => cb.value); // e.g., ["8GB", "12GB"]

    // 4. Get Max Price
    const maxPrice = parseInt(document.getElementById('priceRange').value);

    // Filter the master products list
    filteredProducts = window.products.filter(p => {
        // Brand Match
        const brandMatch = selectedBrands.length === 0 || 
                           selectedBrands.includes(p.brand.toLowerCase());

        // Price Match
        const priceMatch = p.price <= maxPrice;

        // Storage Match
        const pStorage = String(p.storage); // Convert number to string if needed
        const storageMatch = selectedStorages.length === 0 || 
                             selectedStorages.some(s => pStorage.includes(s.replace('GB', '')));

        // RAM Match
        const pRam = String(p.ram);
        const ramMatch = selectedRams.length === 0 || 
                         selectedRams.some(r => pRam.includes(r.replace('GB', '')));

        return brandMatch && priceMatch && storageMatch && ramMatch;
    });

    renderProducts(filteredProducts);
}
// Update price label dynamically
document.getElementById('priceRange')?.addEventListener('input', (e) => {
    document.getElementById('priceValue').textContent = `$${e.target.value}`;
    applyFilters();
});

// ---------------- CART HELPERS ----------------
function updateCartBadge() {
    const badges = document.querySelectorAll('#cart-count-badge');
    const count = cart_shop.reduce((sum, item) => sum + (item.quantity || 1), 0);
    badges.forEach(b => b.textContent = count);
}

    // =============================================
    // Add To Cart
    // =============================================
    const addBtn = document.getElementById('add-to-cart-btn');

    addBtn?.addEventListener('click', () => {

        if (typeof addToCart === 'function') {
            addToCart(product.id);

            addBtn.innerHTML = "✅ Added!";
            addBtn.disabled = true;

            setTimeout(() => {
                addBtn.innerHTML = `<i class="bi bi-cart-plus me-2 fs-4"></i> Add to Cart – Free Delivery`;
                addBtn.disabled = false;
            }, 1500);

        } else {
            alert(`Added ${product.name} to cart!`);
        }
    });