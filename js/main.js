let allProducts = [];

async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '<div class="loading-skeleton">Loading products...</div>';
  try {
    const res = await fetch('products.json');
    if (!res.ok) throw new Error();
    allProducts = await res.json();
    renderProducts(allProducts);
  } catch(err) {
    grid.innerHTML = '<div class="no-results">Error loading products. Please refresh.</div>';
  }
}

function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  if (!products.length) {
    grid.innerHTML = '<div class="no-results">No products match.</div>';
    return;
  }
  grid.innerHTML = products.map(prod => `
    <div class="product-card" data-id="${prod.id}">
      <img src="${prod.local_images[0]}" alt="${escapeHtml(prod.name)}" loading="lazy" onerror="this.src='https://placehold.co/400x300?text=No+Image'">
      <div class="product-info">
        <div class="product-name">${escapeHtml(prod.name)}</div>
        <div class="product-sku">SKU: ${prod.sku}</div>
        <div class="product-price">${prod.price}</div>
        <div class="product-desc">${escapeHtml(prod.short_description).substring(0, 100)}${prod.short_description.length > 100 ? '…' : ''}</div>
        <a href="product.html?id=${encodeURIComponent(prod.id)}" class="view-link">View details →</a>
      </div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]);
}

// Search with debounce
let debounce;
document.getElementById('searchInput')?.addEventListener('input', (e) => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    const query = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query) || (p.short_description && p.short_description.toLowerCase().includes(query)));
    renderProducts(filtered);
  }, 300);
});

// Mobile menu toggle
document.querySelector('.mobile-menu-btn')?.addEventListener('click', () => {
  document.querySelector('nav ul').classList.toggle('show');
});

loadProducts();