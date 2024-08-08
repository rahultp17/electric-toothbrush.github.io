document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('product-list');
            products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');
                productItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>$${product.price.toFixed(2)}</p>
                    <label for="quantity-${product.id}">Quantity:</label>
                    <input type="number" id="quantity-${product.id}" name="quantity" min="1" value="1">
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                `;
                productList.appendChild(productItem);
            });
        });

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const updateCart = () => {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</span>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItems.appendChild(cartItem);
            total += item.price * item.quantity;
        });

        cartTotal.innerText = `$${total.toFixed(2)}`;
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    window.addToCart = (productId) => {
        fetch('products.json')
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.id === productId);
                const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
                const cartItem = cart.find(item => item.id === productId);

                if (cartItem) {
                    cartItem.quantity += quantity;
                } else {
                    cart.push({ ...product, quantity });
                }

                updateCart();
            });
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCart();
    };

    const checkout = () => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        alert(`Your total is $${total.toFixed(2)}. Thank you for your purchase!`);
        cart.length = 0; // Empty the cart
        updateCart(); // Update the cart display
    };

    document.getElementById('checkout-btn').addEventListener('click', checkout);

    updateCart();
});