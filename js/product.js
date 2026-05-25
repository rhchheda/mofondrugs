async function loadProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const container = document.getElementById('productDetail');
  if (!productId) {
    container.innerHTML = '<div class="no-results">No product specified.</div>';
    return;
  }
  try {
    const res = await fetch('products.json');
    const products = await res.json();
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error();
    
    const imagesHtml = product.local_images.map(img => `<img src="${img}" alt="${product.name}" class="detail-img">`).join('');
    container.innerHTML = `
      <div class="detail-grid">
        <div class="detail-images">${imagesHtml}</div>
        <div class="detail-info">
          <h1>${escapeHtml(product.name)}</h1>
          <p class="detail-sku">SKU: ${product.sku}</p>
          <p class="detail-price">${product.price}</p>
          <p class="detail-category">Category: ${product.category}</p>
          <h3>Description</h3>
          <p>${escapeHtml(product.description)}</p>
          ${product.additional_info ? `<h3>Additional Information</h3><p>${escapeHtml(product.additional_info)}</p>` : ''}
          <a href="${product.product_url}" target="_blank" rel="noopener noreferrer" class="cta-button" style="margin-top:1rem; display:inline-block;">View on Original Site →</a>
        </div>
      </div>
    `;
  } catch(err) {
    container.innerHTML = '<div class="no-results">Product not found.</div>';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]);
}

// Mobile menu toggle
document.querySelector('.mobile-menu-btn')?.addEventListener('click', () => {
  document.querySelector('nav ul').classList.toggle('show');
});

loadProductDetail();