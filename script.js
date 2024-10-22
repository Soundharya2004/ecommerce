const API_URL = "https://fakestoreapi.com/products";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Fetch products from Fake Store API
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Display products in the product grid
function displayProducts(products) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(productDiv);
  });
}

// Add product to cart
async function addToCart(productId) {
  try {
    const response = await fetch(`${API_URL}/${productId}`);
    const product = await response.json();
    cart.push(product);
    updateCart();
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}

// Update cart display and count
function updateCart() {
  const cartCount = document.getElementById('cart-count');
  cartCount.textContent = cart.length;

  if (document.getElementById('cart-items')) {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    let totalAmount = 0;
    cart.forEach(item => {
      totalAmount += item.price;
      const cartItem = document.createElement('div');
      cartItem.innerHTML = `
        <p>${item.title}</p>
        <p>$${item.price}</p>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      `;
      cartItems.appendChild(cartItem);
    });

    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
  }
}

// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Checkout functionality
if (document.getElementById('checkout-btn')) {
  document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length > 0) {
      alert("Thank you for your purchase!");
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCart();
    } else {
      alert("Your cart is empty.");
    }
  });
}

// Initialize product list or cart
if (document.getElementById('product-list')) {
  fetchProducts();
} else {
  updateCart();
}
