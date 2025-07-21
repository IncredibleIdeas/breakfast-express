// Update cart count on all pages
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update all cart count elements
    const cartCountElements = document.querySelectorAll('#cart-count, #mobile-cart-count');
    cartCountElements.forEach(el => {
        el.textContent = count;
    });
}