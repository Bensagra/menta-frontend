 // Verificar que el usuario esté autenticado
 if (!sessionStorage.getItem("userId")) {
    location.href = "../sesion/inicio-sesion.html";
  }

  // Función para regresar a la página anterior
  function continueShopping() {
    const screen = parseInt(sessionStorage.getItem("screen"), 10);
    if (screen === 1 || isNaN(screen)) {
        console.log("entro1");
        window.location.href = "../selector/selector.html";
    } else if (screen === 2) {
        console.log("entro");
        window.location.href = "../productos.html";
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const orderHourInput = document.getElementById("order-hour");

    function setMinAndMaxTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 20); // Sumar 20 minutos al horario actual

        // Formatear la hora mínima
        const minHour = now.toTimeString().slice(0, 5);

        // Hora máxima permitida (9:00 PM)
        const maxHour = "20:30";

        // Aplicar restricciones al input
        orderHourInput.min = minHour;
        orderHourInput.max = maxHour;
        if (orderHourInput.value < minHour || orderHourInput.value > maxHour) {
          orderHourInput.value = minHour;
      }
        // Asegurar que el valor actual esté dentro del rango permitido
       orderHourInput.addEventListener("input", () => {
          if (orderHourInput.value < minHour) {
            orderHourInput.value = minHour;
          } else if (orderHourInput.value > maxHour) {
            orderHourInput.value = minHour;
          }
        });
    }

    // Establecer las restricciones al cargar la página
    setMinAndMaxTime();

    // También actualizar cuando el usuario intenta abrir el selector de hora
    orderHourInput.addEventListener("click", setMinAndMaxTime);


    let menuData;
    try {
      const response = await fetch("https://menta-backend.vercel.app/food");
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      menuData = await response.json();
      if (!menuData.data) {
        throw new Error("No se encontraron datos del menú");
      }
    } catch (error) {
      console.error("Error al cargar los datos del menú:", error);
      document.getElementById("cart-list").innerHTML = `<p style="color:red; text-align:center;">Error cargando los datos. Inténtelo más tarde.</p>`;
      return;
    }
    
    renderCart();

    function getProductById(id) {
      for (const category of menuData.data) {
        const product = category.food.find(item => item.id == id);
        if (product) return product;
      }
      return null;
    }

    // Función para renderizar el carrito en pantalla
    function renderCart() {
      const cartList = document.getElementById("cart-list");
      cartList.innerHTML = "";
      let total = 0;
      const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

      if (cart.length === 0) {
        cartList.innerHTML = `<p style="text-align:center;">El carrito está vacío.</p>`;
      }

      cart.forEach(item => {
        const product = getProductById(item.id);
        if (!product) return;

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <div class="cart-item-info">
            <span class="product-name">${product.name}</span>
            <span class="product-price">$${product.price.toFixed(2)}</span>
          </div>
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateCart(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn" onclick="updateCart(${item.id}, 1)">+</button>
          </div>
        `;
        cartList.appendChild(cartItem);
      });

      document.getElementById("order-total").textContent = total.toFixed(2);
    }

    // Función para actualizar el carrito
    window.updateCart = function(productId, change) {
      productId = Number(productId);
      let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
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
      renderCart();
    };

    // Función para enviar la orden al servidor con manejo de errores
    window.placeOrder = async function() {
      const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
      const notes = document.getElementById("notes").value;
      const orderHourInput = document.getElementById("order-hour").value; // Valor en "HH:MM"
      
      // Verificar que se haya seleccionado la hora
      if (!orderHourInput) {
        alert("Por favor, seleccione la hora de retiro.");
        return;
      }

      // Verificar que el carrito no esté vacío
      if (cart.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de hacer un pedido.");
        return;
      }

      // Convertir el valor "HH:MM" a una fecha con el día de hoy en formato ISO
      const now = new Date();
      const [hours, minutes] = orderHourInput.split(":");
      const orderHourFormatted = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes).toISOString();

      try {
        const res = await fetch("https://menta-backend.vercel.app/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: cart,
            userId: sessionStorage.getItem("userId"),
            notes: notes,
            hour: orderHourFormatted
          })
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data);
          sessionStorage.removeItem("cart");
          sessionStorage.setItem("number", data.data);
          location.href = "../confi/confirmacion.html";
        } else {
          const data = await res.json();
          alert("Hubo un error al realizar el pedido. " + (data.message || ""));
        }
      } catch (error) {
        console.error("Error en la conexión:", error);
        alert("Error al conectar con el servidor. Inténtelo de nuevo más tarde.");
      }
    };
  });