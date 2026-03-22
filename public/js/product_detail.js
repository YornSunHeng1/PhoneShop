// =============================================
// Product Detail Page Script (FINAL FIXED)
// =============================================

// Get ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));

// Find product
const product = window.products?.find(p => p.id === productId);

// If not found
if (!product) {
    document.body.innerHTML = `
        <div class="container py-5 text-center">
            <h2 class="mb-4">
                Product not found (ID: ${productId || 'missing'})
            </h2>
            <a href="index.html" class="btn btn-cyan-gradient px-5 py-3">
                Back to Shop
            </a>
        </div>
    `;
} else {

    // =============================================
    // Fill Product Info
    // =============================================
    document.getElementById('brand').textContent = product.brand || '';
    document.getElementById('name').textContent = product.name || '';
    document.getElementById('price').textContent = `$${product.price || 0}`;
    document.getElementById('description').textContent = product.description || '';

    // =============================================
    // MAIN IMAGE
    // =============================================
    const mainImage = document.getElementById('main-image');
    const thumbsContainer = document.getElementById('thumbnails-container');

    const images = product.images?.length
        ? product.images
        : ['https://picsum.photos/800/800?random'];

    mainImage.src = images[0];

    thumbsContainer.innerHTML = '';

    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Thumbnail ${index + 1}`;
        img.className = 'thumbnail' + (index === 0 ? ' active' : '');

        img.addEventListener('click', () => {

            mainImage.style.opacity = '0';

            setTimeout(() => {
                mainImage.src = src;
                mainImage.style.opacity = '1';
            }, 150);

            document.querySelectorAll('.thumbnail').forEach(el => {
                el.classList.remove('active');
            });

            img.classList.add('active');
        });

        thumbsContainer.appendChild(img);
    });

    // =============================================
    // 🔥 FIXED SPECS SECTION (NEW ADD)
    // =============================================
    const specsBox = document.getElementById('specs-box');

    if (specsBox) {
        specsBox.innerHTML = `
            <div class="col-6 col-md-3">
                <div class="bg-dark p-3 rounded text-center">
                    <small class="text-secondary">Storage</small><br>
                    <strong>${product.storage || '-'}</strong>
                </div>
            </div>

            <div class="col-6 col-md-3">
                <div class="bg-dark p-3 rounded text-center">
                    <small class="text-secondary">RAM</small><br>
                    <strong>${product.ram || '-'}</strong>
                </div>
            </div>

            <div class="col-6 col-md-3">
                <div class="bg-dark p-3 rounded text-center">
                    <small class="text-secondary">Screen</small><br>
                    <strong>${product.screen || '-'}</strong>
                </div>
            </div>

            <div class="col-6 col-md-3">
                <div class="bg-dark p-3 rounded text-center">
                    <small class="text-secondary">Battery</small><br>
                    <strong>${product.battery || '-'}</strong>
                </div>
            </div>
        `;
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

}