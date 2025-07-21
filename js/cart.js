document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart if not exists
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Load cart items
    loadCartItems();
    
    // Update cart count
    updateCartCount();
    
    // Apply promo code
    document.getElementById('apply-promo').addEventListener('click', function() {
        const promoCode = document.getElementById('promo-code').value.trim();
        const promoMessage = document.getElementById('promo-message');
        
        if (promoCode === 'BREAKFAST20') {
            // Save promo code
            localStorage.setItem('promoCode', JSON.stringify({
                code: promoCode,
                discount: 0.2 // 20% discount
            }));
            
            promoMessage.textContent = '20% discount applied!';
            promoMessage.className = 'mt-2 text-sm text-green-600';
            promoMessage.classList.remove('hidden');
            
            // Reload cart to apply discount
            loadCartItems();
        } else if (promoCode === '') {
            promoMessage.textContent = 'Please enter a promo code';
            promoMessage.className = 'mt-2 text-sm text-red-600';
            promoMessage.classList.remove('hidden');
        } else {
            promoMessage.textContent = 'Invalid promo code';
            promoMessage.className = 'mt-2 text-sm text-red-600';
            promoMessage.classList.remove('hidden');
        }
    });
});

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const checkoutItemsContainer = document.getElementById('checkout-items');
    
    if (cart.length === 0) {
        // Empty cart
        cartItemsContainer.innerHTML = `
            <div class="p-6 text-center text-gray-500">
                <i class="fas fa-shopping-cart text-4xl mb-4 text-gray-300"></i>
                <p>Your cart is empty</p>
                <a href="menu.html" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                    Browse Menu
                </a>
            </div>
        `;
        
        if (checkoutItemsContainer) {
            checkoutItemsContainer.innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    <i class="fas fa-shopping-cart text-2xl mb-2 text-gray-300"></i>
                    <p>No items in your order</p>
                </div>
            `;
        }
        
        // Disable checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) checkoutBtn.disabled = true;
        
        // Update totals
        updateTotals(0);
        return;
    }
    
    // Populate cart items
    let cartHTML = '';
    let checkoutHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        
        cartHTML += `
            <div class="p-6 flex flex-col sm:flex-row">
                <div class="flex-shrink-0">
                    <div class="h-20 w-20 rounded-lg bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center">
                        <span class="text-orange-500 font-medium">${item.quantity}x</span>
                    </div>
                </div>
                <div class="mt-4 sm:mt-0 sm:ml-6 flex-1">
                    <div class="flex items-start justify-between">
                        <div>
                            <h3 class="text-base font-medium text-gray-900">${item.name}</h3>
                            <p class="mt-1 text-sm text-gray-600">$${item.price.toFixed(2)} each</p>
                        </div>
                        <div class="ml-4">
                            <div class="flex items-center">
                                <button class="decrease-quantity text-gray-400 hover:text-orange-500" data-id="${item.id}">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="mx-2 text-gray-900">${item.quantity}</span>
                                <button class="increase-quantity text-gray-400 hover:text-orange-500" data-id="${item.id}">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                        <p class="text-sm font-medium text-gray-900">$${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="remove-item text-sm font-medium text-orange-600 hover:text-orange-500" data-id="${item.id}">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        checkoutHTML += `
            <div class="flex justify-between">
                <div class="flex">
                    <div class="h-16 w-16 rounded-md bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center">
                        <span class="text-orange-500 font-medium">${item.quantity}x</span>
                    </div>
                    <div class="ml-4">
                        <h4 class="text-sm font-medium text-gray-900">${item.name}</h4>
                        <p class="text-sm text-gray-600">$${item.price.toFixed(2)} each</p>
                    </div>
                </div>
                <span class="text-sm font-medium text-gray-900">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    
    if (checkoutItemsContainer) {
        checkoutItemsContainer.innerHTML = checkoutHTML;
    }
    
    // Enable checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    // Update totals
    updateTotals(subtotal);
    
    // Add event listeners for quantity buttons
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(this.dataset.id, 1);
        });
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(this.dataset.id, -1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            removeItem(this.dataset.id);
        });
    });
}

function updateQuantity(itemId, change) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        // Remove item if quantity reaches 0
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        // Save cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Reload cart
        loadCartItems();
        updateCartCount();
    }
}

function removeItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart = cart.filter(item => item.id !== itemId);
    
    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Reload cart
    loadCartItems();
    updateCartCount();
}

function updateTotals(subtotal) {
    // Get promo code if exists
    const promoCode = JSON.parse(localStorage.getItem('promoCode'));
    let discount = 0;
    
    if (promoCode) {
        discount = subtotal * promoCode.discount;
        subtotal -= discount;
    }
    
    const deliveryFee = 2.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;
    
    // Update cart page totals
    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = `$${(subtotal + discount).toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        
        if (discount > 0) {
            document.getElementById('promo-message').textContent = `Discount applied: -$${discount.toFixed(2)}`;
            document.getElementById('promo-message').className = 'mt-2 text-sm text-green-600';
            document.getElementById('promo-message').classList.remove('hidden');
        }
    }
    
    // Update checkout page totals
    if (document.getElementById('checkout-subtotal')) {
        document.getElementById('checkout-subtotal').textContent = `$${(subtotal + discount).toFixed(2)}`;
        document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
    }
    
    // Update order status page totals
    if (document.getElementById('order-subtotal')) {
        document.getElementById('order-subtotal').textContent = `$${(subtotal + discount).toFixed(2)}`;
        document.getElementById('order-tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('order-total').textContent = `$${total.toFixed(2)}`;
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update all cart count elements
    const cartCountElements = document.querySelectorAll('#cart-count, #mobile-cart-count');
    cartCountElements.forEach(el => {
        el.textContent = count;
    });
}