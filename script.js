 // Cart functionality
 let cart = [];
        
 // DOM elements
 const cartBtn = document.getElementById('cart-btn');
 const mobileCartBtn = document.getElementById('mobile-cart-btn');
 const cartSidebar = document.getElementById('cart-sidebar');
 const closeCart = document.getElementById('close-cart');
 const cartItems = document.getElementById('cart-items');
 const cartSubtotal = document.getElementById('cart-subtotal');
 const cartTotal = document.getElementById('cart-total');
 const cartCount = document.getElementById('cart-count');
 const mobileCartCount = document.getElementById('mobile-cart-count');
 const addToCartButtons = document.querySelectorAll('.add-to-cart');
 const checkoutBtn = document.getElementById('checkout-btn');
 const checkoutModal = document.getElementById('checkout-modal');
 const closeCheckoutModal = document.getElementById('close-checkout-modal');
 const checkoutForm = document.getElementById('checkout-form');
 const confirmationModal = document.getElementById('confirmation-modal');
 const closeConfirmationModal = document.getElementById('close-confirmation-modal');
 const modalTotal = document.getElementById('modal-total');
 const paymentMethod = document.getElementById('payment');
 const creditCardFields = document.getElementById('credit-card-fields');
 const mobileMenuBtn = document.getElementById('mobile-menu-btn');
 const mobileMenu = document.getElementById('mobile-menu');
 
 // Toggle mobile menu
 mobileMenuBtn.addEventListener('click', () => {
     mobileMenu.classList.toggle('hidden');
 });
 
 // Toggle cart sidebar
 cartBtn.addEventListener('click', toggleCart);
 mobileCartBtn.addEventListener('click', toggleCart);
 closeCart.addEventListener('click', toggleCart);
 
 function toggleCart() {
     cartSidebar.classList.toggle('translate-x-full');
     cartSidebar.classList.toggle('translate-x-0');
 }
 
 // Add to cart functionality
 addToCartButtons.forEach(button => {
     button.addEventListener('click', (e) => {
         const id = button.getAttribute('data-id');
         const name = button.getAttribute('data-name');
         const price = parseFloat(button.getAttribute('data-price'));
         const image = button.getAttribute('data-image');
         
         // Check if item already exists in cart
         const existingItem = cart.find(item => item.id === id);
         
         if (existingItem) {
             existingItem.quantity += 1;
         } else {
             cart.push({
                 id,
                 name,
                 price,
                 image,
                 quantity: 1
             });
         }
         
         updateCart();
         showAddedToCartNotification(name);
     });
 });
 
 // Show notification when item is added to cart
 function showAddedToCartNotification(productName) {
     const notification = document.createElement('div');
     notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center';
     notification.innerHTML = `
         <i class="fas fa-check-circle mr-2"></i>
         ${productName} added to cart
     `;
     
     document.body.appendChild(notification);
     
     setTimeout(() => {
         notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
         setTimeout(() => {
             notification.remove();
         }, 300);
     }, 2000);
 }
 
 // Update cart UI
 function updateCart() {
     // Update cart count
     const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
     cartCount.textContent = totalItems;
     mobileCartCount.textContent = totalItems;
     
     // Update cart items
     if (cart.length === 0) {
         cartItems.innerHTML = `
             <div class="text-center py-10">
                 <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-3"></i>
                 <p class="text-gray-500">Your cart is empty</p>
             </div>
         `;
     } else {
         cartItems.innerHTML = cart.map(item => `
             <div class="cart-item mb-4 pb-4 border-b border-gray-200 fade-in">
                 <div class="flex">
                     <div class="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                         <img src="${item.image}" alt="${item.name}" class="h-full w-full object-cover">
                     </div>
                     <div class="ml-4 flex-1">
                         <div class="flex justify-between">
                             <h4 class="text-sm font-medium text-gray-900">${item.name}</h4>
                             <p class="text-sm font-medium text-gray-900">$${(item.price * item.quantity).toFixed(2)}</p>
                         </div>
                         <div class="flex items-center mt-1">
                             <button class="decrease-quantity text-gray-500 hover:text-purple-600" data-id="${item.id}">
                                 <i class="fas fa-minus text-xs"></i>
                             </button>
                             <span class="mx-2 text-sm text-gray-500">${item.quantity}</span>
                             <button class="increase-quantity text-gray-500 hover:text-purple-600" data-id="${item.id}">
                                 <i class="fas fa-plus text-xs"></i>
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
         `).join('');
         
         // Add event listeners to quantity buttons
         document.querySelectorAll('.decrease-quantity').forEach(button => {
             button.addEventListener('click', (e) => {
                 const id = button.getAttribute('data-id');
                 const item = cart.find(item => item.id === id);
                 
                 if (item.quantity > 1) {
                     item.quantity -= 1;
                 } else {
                     cart = cart.filter(item => item.id !== id);
                 }
                 
                 updateCart();
             });
         });
         
         document.querySelectorAll('.increase-quantity').forEach(button => {
             button.addEventListener('click', (e) => {
                 const id = button.getAttribute('data-id');
                 const item = cart.find(item => item.id === id);
                 item.quantity += 1;
                 updateCart();
             });
         });
     }
     
     // Update totals
     const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
     cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
     cartTotal.textContent = `$${subtotal.toFixed(2)}`;
     modalTotal.textContent = `$${subtotal.toFixed(2)}`;
 }
 
 // Checkout flow
 checkoutBtn.addEventListener('click', () => {
     if (cart.length === 0) {
         alert('Your cart is empty. Add some products before checkout.');
         return;
     }
     
     toggleCart();
     checkoutModal.classList.remove('hidden');
 });
 
 closeCheckoutModal.addEventListener('click', () => {
     checkoutModal.classList.add('hidden');
 });
 
 closeConfirmationModal.addEventListener('click', () => {
     confirmationModal.classList.add('hidden');
 });
 
 // Show credit card fields when credit card is selected
 paymentMethod.addEventListener('change', (e) => {
     if (e.target.value === 'credit') {
         creditCardFields.classList.remove('hidden');
     } else {
         creditCardFields.classList.add('hidden');
     }
 });
 
 // Form submission
 checkoutForm.addEventListener('submit', (e) => {
     e.preventDefault();
     
     // In a real app, you would process payment here
     // For demo purposes, we'll just show a confirmation
     
     // Generate random order number
     const orderNumber = Math.floor(Math.random() * 900000) + 100000;
     document.getElementById('order-number').textContent = orderNumber;
     
     // Calculate delivery date (3-5 days from now)
     const deliveryDate = new Date();
     deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3);
     const options = { weekday: 'long', month: 'long', day: 'numeric' };
     document.getElementById('delivery-date').textContent = deliveryDate.toLocaleDateString('en-US', options);
     
     // Close checkout modal and show confirmation
     checkoutModal.classList.add('hidden');
     confirmationModal.classList.remove('hidden');
     
     // Clear cart
     cart = [];
     updateCart();
 });
 
 // Initialize cart
 updateCart();