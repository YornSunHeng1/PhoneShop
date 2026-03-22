// =============================================
// PhoneHub - Full JavaScript (Bootstrap compatible)
// =============================================

// let products = [
//     { id: 1, name: "iPhone 16 Pro Max", brand: "Apple", price: 1299, image: "https://picsum.photos/id/1015/600/600", rating: 5, description: "Titanium design. A18 Pro chip. 48MP Fusion camera." },
//     { id: 2, name: "Galaxy S25 Ultra", brand: "Samsung", price: 1199, image: "https://picsum.photos/id/201/600/600", rating: 4.8, description: "S Pen included. 200MP camera. Brightest display ever." },
//     { id: 3, name: "Redmi Note 14 Pro", brand: "Xiaomi", price: 299, image: "https://picsum.photos/id/29/600/600", rating: 4.5, description: "120Hz AMOLED. 108MP camera. 5500mAh battery." },
//     { id: 4, name: "Oppo Reno12 5G", brand: "Oppo", price: 449, image: "https://picsum.photos/id/160/600/600", rating: 4.7, description: "Ultra slim design. AI portrait camera. 80W fast charging." },
//     { id: 5, name: "iPhone 16", brand: "Apple", price: 799, image: "https://picsum.photos/id/64/600/600", rating: 5, description: "All-new Camera Control. Stunning new colors." },
//     { id: 6, name: "Galaxy Z Fold6", brand: "Samsung", price: 1799, image: "https://picsum.photos/id/251/600/600", rating: 4.9, description: "Foldable masterpiece. 7.6 inch inner display." },
//     { id: 7, name: "Poco X7 Pro", brand: "Xiaomi", price: 349, image: "https://picsum.photos/id/29/600/600", rating: 4.6, description: "Dimensity 8400. 120W hyper charging." },
//     { id: 8, name: "Pixel 9 Pro XL", brand: "Google", price: 999, image: "https://picsum.photos/id/201/600/600", rating: 4.8, description: "Gemini AI. Best camera in the world." }
// ];

// =============================================
// Navbar show/hide on scroll
// =============================================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
const delta = 5;           // min scroll amount to trigger
const navbarHeight = navbar?.offsetHeight || 80;
// let cart = JSON.parse(localStorage.getItem('phoneHubCart')) || [];

window.addEventListener('scroll', () => {
    if (!navbar) return;

    let st = window.pageYOffset || document.documentElement.scrollTop;

    // Add subtle shadow when scrolled down a bit
    if (st > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Only react if scrolled more than delta pixels
    if (Math.abs(lastScrollTop - st) <= delta) return;

    if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down → hide
        navbar.classList.remove('navbar-scroll-up');
        navbar.classList.add('navbar-scroll-down');
    } else {
        // Scroll Up → show
        if (st + window.innerHeight < document.documentElement.scrollHeight) {
            navbar.classList.remove('navbar-scroll-down');
            navbar.classList.add('navbar-scroll-up');
        }
    }

    lastScrollTop = st <= 0 ? 0 : st;  // For Mobile or negative scrolling
}, { passive: true });   // better scroll performance

let cart = [];

// =============================================
// Render Products Grid
// =============================================
function renderProducts(filteredProducts) {
    const container = document.getElementById('products-grid');
    if (!container) return;

    container.innerHTML = '';

    filteredProducts.forEach(product => {

        // ✅ FIX: get first image safely
        const mainImage = product.images?.[0] || 'https://via.placeholder.com/600x600?text=No+Image';

        const col = document.createElement('div');
        col.className = 'col';

        col.innerHTML = `
            <div class="card-neon h-100 overflow-hidden position-relative"
                 style="cursor: pointer;"
                 onclick="window.location.href = '../public/product-detail.html?id=${product.id}'">

                <div class="position-relative">
                    <img src="${mainImage}" 
                         class="product-img card-img-top w-100 object-cover"
                         style="h-100  transition: transform 0.4s ease;"
                         alt="${product.name}"
                         onerror="this.onerror=null;this.src='https://via.placeholder.com/600x600?text=No+Image';">

                    <div class="rating-badge position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill text-white bg-dark bg-opacity-75">
                        ★ ${product.rating}
                    </div>
                </div>

                <div class="card-body p-4 d-flex flex-column">
                    <div class="text-cyan small fw-medium mb-1">${product.brand}</div>
                    
                    <h5 class="card-title fw-bold mb-3">
                        ${product.name}
                    </h5>

                    <div class="fs-4 fw-bold text-cyan mt-auto mb-3">
                        $${product.price}
                    </div>

                    <button onclick="event.stopPropagation(); addToCart(${product.id})" 
                            class="btn btn-light w-100 py-2 rounded-pill">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        // hover effect
        const card = col.querySelector('.card-neon');
        const img = col.querySelector('img');

        card.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05)';
        });

        card.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });

        container.appendChild(col);
    });
}
// =============================================
// Cart Functions
// =============================================
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();

    // Show confirmation modal
    document.getElementById('confirm-product-name').textContent = product.name;
    const modal = new bootstrap.Modal(document.getElementById('addToCartModal'));
    modal.show();
}

// Confirmation toast when item is added
function showAddToCartConfirmation(productName) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 80px; right: 30px; z-index: 99999;
        background: linear-gradient(135deg, #1a1a2e, #0f0f1f);
        color: white; padding: 16px 24px 16px 20px;
        border-radius: 16px; border: 1px solid #00d4ff33;
        box-shadow: 0 10px 30px rgba(0, 212, 255, 0.25);
        display: flex; align-items: center; gap: 14px;
        font-weight: 500; max-width: 380px;
        animation: slideInToast 0.4s ease forwards;
    `;

    toast.innerHTML = `
        <i class="bi bi-check-circle-fill" style="font-size: 1.6rem; color: #00d4ff;"></i>
        <div>
            <div style="font-size: 1.05rem;">Added to cart!</div>
            <div style="font-size: 0.9rem; opacity: 0.85; margin-top: 3px;">
                ${productName}
            </div>
        </div>
    `;

    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.transition = 'all 0.4s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (!countEl) return;
    
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    countEl.textContent = count;
}

function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 text-secondary">
                <i class="bi bi-cart-x fs-1 mb-3 d-block"></i>
                <p>Your cart is empty</p>
                <button class="btn btn-outline-light mt-3" data-bs-dismiss="offcanvas">
                    Continue Shopping
                </button>
            </div>
        `;
        updateTotals(0);
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        const qty = item.quantity || 1;
        const totalPrice = item.price * qty;
        subtotal += totalPrice;

        const itemEl = document.createElement('div');
        itemEl.className = 'd-flex gap-3 mb-4 pb-3 border-bottom border-secondary';
        itemEl.innerHTML = `
            <img src="${item.image}" class="rounded" style="width:80px; height:80px; object-fit:cover;">
            <div class="flex-grow-1">
                <h6 class="mb-1">${item.name}</h6>
                <small class="text-secondary d-block">${item.brand} • $${item.price}</small>
                
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary" onclick="changeQuantity(${index}, -1)">-</button>
                        <button class="btn btn-outline-secondary disabled">${qty}</button>
                        <button class="btn btn-outline-secondary" onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold">$${totalPrice}</div>
                        <button class="btn btn-sm text-danger p-0 mt-1" onclick="removeFromCart(${index})">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(itemEl);
    });

    updateTotals(subtotal);
}

function updateTotals(subtotal) {
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    if (subtotalEl) subtotalEl.textContent = `$${subtotal}`;
    if (totalEl) totalEl.textContent = `$${subtotal}`;
}

function changeQuantity(index, delta) {
    let qty = (cart[index].quantity || 1) + delta;
    if (qty < 1) qty = 1;
    cart[index].quantity = qty;
    renderCart();
    updateCartCount();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
    updateCartCount();
}

// =============================================
// Product Modal (Bootstrap)
// =============================================
function showProductModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // Fill modal content
    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-brand').textContent = product.brand;
    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-price').textContent = `$${product.price}`;
    document.getElementById('modal-description').innerHTML = `
    <p class="lead">${product.description}</p>
        <div class="row g-3 mt-4 small">
            <div class="col-6">
                <div class="bg-dark p-3 rounded">Storage: ${product.storage}</div>
            </div>
            <div class="col-6">
                <div class="bg-dark p-3 rounded">RAM: ${product.ram}</div>
            </div>
            <div class="col-6">
                <div class="bg-dark p-3 rounded">Screen: ${product.screen}</div>
            </div>
            <div class="col-6">
                <div class="bg-dark p-3 rounded">Battery: ${product.battery}</div>
            </div>
        </div>
    `;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();

    // Handle add to cart from modal
    const addBtn = document.getElementById('add-to-cart-from-modal');
    addBtn.onclick = () => {
        addToCart(id);
        modal.hide();
    };
}

// =============================================
// Toast Notification
// =============================================
function showToast(message) {
    const toastContainer = document.createElement('div');
    toastContainer.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; z-index: 9999;
        background: #111; color: white; padding: 16px 24px;
        border-radius: 9999px; border: 1px solid #333;
        box-shadow: 0 10px 25px rgba(0,0,0,0.6);
        display: flex; align-items: center; gap: 12px;
        animation: slideIn 0.4s ease;
    `;
    toastContainer.innerHTML = `
        <i class="bi bi-check-circle-fill text-cyan fs-4"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toastContainer);

    setTimeout(() => {
        toastContainer.style.transition = 'all 0.4s ease';
        toastContainer.style.opacity = '0';
        toastContainer.style.transform = 'translateY(20px)';
        setTimeout(() => toastContainer.remove(), 400);
    }, 2800);
}

// =============================================
// Search & Filter & Sort
// =============================================
function searchProducts() {
    const input = document.getElementById('search-input');
    if (!input) return renderProducts(products);

    const query = input.value.toLowerCase().trim();
    if (!query) return renderProducts(products);

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query)
    );
    renderProducts(filtered);
}

function filterCategory(brand) {
    let filtered = products;
    if (brand !== 'all') {
        filtered = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }
    renderProducts(filtered);
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
}

function sortProducts(type) {
    let sorted = [...products];
    if (type === 'price-low')  sorted.sort((a, b) => a.price - b.price);
    if (type === 'price-high') sorted.sort((a, b) => b.price - a.price);
    renderProducts(sorted);
}

// =============================================
// Cart Offcanvas Events
// =============================================
document.addEventListener('show.bs.offcanvas', function (e) {
    if (e.target.id === 'cartOffcanvas') {
        renderCart();
    }
});

// =============================================
// Initialize
// =============================================
window.addEventListener('load', () => {
    renderProducts(products);
    updateCartCount();
    console.log('%cPhoneHub – Bootstrap version loaded', 'color:#00d4ff; font-size:16px;');
});

        fetch('components/navbar.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('navbar-placeholder').innerHTML = data;
            })
            .catch(err => console.error('Error loading navbar:', err));

        // Load Footer
        fetch('components/footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer-placeholder').innerHTML = data;
            })
            .catch(err => console.error('Error loading footer:', err));
