document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart if not exists
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Update cart count
    updateCartCount();
    
    // Filter menu items
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-gradient-to-r', 'from-orange-500', 'to-yellow-500', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-100');
            });
            
            this.classList.add('bg-gradient-to-r', 'from-orange-500', 'to-yellow-500', 'text-white');
            this.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-100');
            
            // Filter items
            const category = this.dataset.category;
            const menuItems = document.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            
            // Get current cart
            let cart = JSON.parse(localStorage.getItem('cart'));
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }
            
            // Save cart
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count
            updateCartCount();
            
            // Show added notification
            showAddedNotification(name);
        });
    });
    
    // Show notification when item is added to cart
    function showAddedNotification(itemName) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center animate-bounce';
        notification.innerHTML = `
            <div class="mr-2 h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white">
                <i class="fas fa-check"></i>
            </div>
            <span class="text-gray-800">Added ${itemName} to cart</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('animate-bounce');
            notification.classList.add('animate-fade-out');
            
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 2000);
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
});