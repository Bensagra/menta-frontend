// Redirige a inicio de sesión si el usuario no está autenticado
if (!sessionStorage.getItem("userId")) {
    location.href = "../sesion/inicio-sesion.html";
  }
  
  document.addEventListener("DOMContentLoaded", async () => {
    const categoriesContainer = document.getElementById("categories");
    const productList = document.getElementById("product-list");
    const categoryTitle = document.getElementById("category-name");
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    
    // Función para actualizar el carrito y mostrar cantidades actualizadas
    function updateCart(productId, change) {
      productId = Number(productId);
      let productIndex = cart.findIndex(item => item.id === productId);
      if (productIndex !== -1) {
        cart[productIndex].quantity += change;
        if (cart[productIndex].quantity <= 0) {
          cart.splice(productIndex, 1);
        }
      } else if (change > 0) {
        cart.push({ id: productId, quantity: change });
      }
      sessionStorage.setItem("cart", JSON.stringify(cart));
      updateDisplayedQuantities();
    }
    window.updateCart = updateCart;
    
    // Actualiza la visualización de cantidades en la lista de productos
    function updateDisplayedQuantities() {
      document.querySelectorAll(".product").forEach(productDiv => {
        let productId = Number(productDiv.getAttribute("data-id"));
        let cartItem = cart.find(item => item.id === productId);
        let quantitySpan = productDiv.querySelector(".quantity-controls span");
        quantitySpan.textContent = cartItem ? cartItem.quantity : "0";
      });
    }
    
    // Función para mostrar mensajes de error en la sección de productos
    function showError(message) {
      productList.innerHTML = `<p style="color:red; text-align:center;">${message}</p>`;
    }
    
    // Renderiza las categorías
    function renderCategories(menuData) {
      menuData.forEach(category => {
        const btn = document.createElement("button");
        btn.classList.add("category-btn");
        btn.innerHTML = `<img src="${category.img}" alt="${category.name}">`;
        btn.addEventListener("click", () => {
          document.querySelectorAll(".category-btn").forEach(btn => btn.style.backgroundColor = "#f0ddca");
          btn.style.backgroundColor = "#AA7859";
          categoryTitle.textContent = category.name;
          renderProducts(category.food);
        });
        categoriesContainer.appendChild(btn);
      });
    }
    
    // Renderiza los productos de una categoría
    function renderProducts(products) {
      productList.innerHTML = "";
      products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.setAttribute("data-id", product.id);
        let cartItem = cart.find(item => item.id === product.id);
        let quantity = cartItem ? cartItem.quantity : 0;
        productDiv.innerHTML = `
          <span>${product.name} - $${product.price}</span>
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateCart(${product.id}, -1)">-</button>
            <span>${quantity}</span>
            <button class="quantity-btn" onclick="updateCart(${product.id}, 1)">+</button>
          </div>
        `;
        productList.appendChild(productDiv);
      });
    }
    
    // Cargar los datos del menú con manejo de errores
    try {
      productList.innerHTML = "<p>Cargando menú...</p>";
      const response = await fetch("https://menta-backend.vercel.app/food");
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const menuResponse = await response.json();
      if (!menuResponse.data) {
        throw new Error("No se encontraron datos del menú");
      }
      productList.innerHTML = "";
      renderCategories(menuResponse.data);
    } catch (error) {
      console.error("Error cargando el menú:", error);
      showError("Error cargando el menú. Por favor, intenta nuevamente más tarde.");
    }
  });