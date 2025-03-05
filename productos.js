let productosGlobales = []; // Almacena los productos de la API
let cart = []; // Carrito: lista de objetos { id, quantity }
if (sessionStorage.getItem('userId')) {
  document.getElementById("user").style.display = "none";

}
document.addEventListener("DOMContentLoaded", () => {
  fetch("https://menta-backend.vercel.app/food")
    .then(response => response.json())
    .then(data => {
      if (data.valid) {
        document.getElementById("loadingOverlay").style.display = "none";
        productosGlobales = data.data;
        renderizarCategorias(data.data);
        if (sessionStorage.getItem("name")) {
    renderizarProductos([JSON.parse(sessionStorage.getItem("name"))]);
    sessionStorage.removeItem("name");
  } else {
        renderizarProductos(data.data);
  }
      }
    })
    .catch(error => console.error("Error al cargar datos:", error));

  // Evento para el buscador
  document.getElementById("buscador").addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    const categoriasFiltradas = productosGlobales.map(categoria => ({
      ...categoria,
      food: categoria.food.filter(producto => producto.name.toLowerCase().includes(texto))
    })).filter(categoria => categoria.food.length > 0);
    
    renderizarProductos(categoriasFiltradas);
  });
  
  updateCartCounter();
});

function renderizarCategorias(categorias) {
  const listaCategorias = document.getElementById("categorias-lista");
  listaCategorias.innerHTML = "";
  categorias.forEach(categoria => {
    const li = document.createElement("li");
    li.textContent = categoria.name;
    li.addEventListener("click", () => {
        console.log(categoria);
      renderizarProductos([categoria]);
      if (window.innerWidth < 992) {
        $('#sidebarContent').collapse('hide');
      }
    });
    listaCategorias.appendChild(li);
  });
}

function renderizarProductos(categorias) {
  const listaProductos = document.getElementById("productos-lista");
  listaProductos.innerHTML = "";
  
  const horaActual = new Date().getHours();
  const fueraDeHorario = horaActual < 8 || horaActual > 20;
  
  categorias.forEach(categoria => {
    categoria.food.forEach(producto => {
      if (!producto || !producto.image || !producto.name || !producto.price) return;
      
      const div = document.createElement("div");
      div.classList.add("producto");
      
      let contenido = `
        <img src="${producto.image}" alt="${producto.name}">
        <h3 class="mt-4">${producto.name}</h3>
      `;
      
      if (producto.description !== ".") {
        contenido += `<p style="color=#365a54">${producto.description}</p>`;
      }
      contenido += `<p style="color=#365a54">${categoria.name}</p>`;

      
      contenido += `<p>$${producto.price}</p>`;
      
      if (!fueraDeHorario) {
        contenido += `<button class="btn btn-primary btn-block" onclick="addToCart('${producto.id}')">Agregar al carrito</button>`;
      }
      
      div.innerHTML = contenido;
      listaProductos.appendChild(div);
    });
  });
}

function addToCart(productId) {
   let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  const item = cart.find(product => parseInt(product.id) === parseInt(productId));
  if (item) {
    item.quantity++;
  } else {
    cart.push({ id: parseInt(productId), quantity: 1 });
  }
  sessionStorage.setItem("cart", JSON.stringify(cart));
  console.log("Carrito actual:", cart);
  showAlert();
}

function addToCart(productId) {
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  const item = cart.find(product => parseInt(product.id) === parseInt(productId));
  if (item) {
    item.quantity++;
  } else {
    cart.push({ id: parseInt(productId), quantity: 1 });
  }
  sessionStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
  console.log("Carrito actual:", cart);
  showAlert();
}


function updateCartCounter() {
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const counter = document.getElementById("cart-counter");
  if (totalItems > 0) {
    counter.style.display = "block";
    counter.textContent = totalItems;
  } else {
    counter.style.display = "none";
  }
}