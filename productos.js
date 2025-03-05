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
  categorias.forEach(categoria => {
    categoria.food.forEach(producto => {
        if (new Date().getHours() <8 || new Date().getHours() >20) {
        const div = document.createElement("div");
        div.classList.add("producto");
        if (producto.description != ".") {
          div.innerHTML = `
          <img src="${producto.image}" alt="${producto.name}">
          <h3>${producto.name}</h3>
          <p>${producto.description}</p>
          <p>$${producto.price}</p>
          `;
          listaProductos.appendChild(div);
        }else{
          if (producto.description != ".") {
            div.innerHTML = `
            <img src="${producto.image}" alt="${producto.name}">
            <h3>${producto.name}</h3>
            <p>$${producto.price}</p>
            `;
            listaProductos.appendChild(div);
          }
        }
       

    
}else{
const div = document.createElement("div");

      div.classList.add("producto");
      if (producto.description != ".") {
        div.innerHTML = `
        <img src="${producto.image}" alt="${producto.name}">
        <h3>${producto.name}</h3>
        <p>${producto.description}</p>
        <p>$${producto.price}</p>
        <button class="btn btn-primary btn-block" id="btn" onclick="addToCart('${producto.id}')">Agregar al carrito</button>

        `;
        listaProductos.appendChild(div);
      }else{
        if (producto.description != ".") {
          div.innerHTML = `
          <img src="${producto.image}" alt="${producto.name}">
          <h3>${producto.name}</h3>
          <p>$${producto.price}</p>
          <button class="btn btn-primary btn-block" id="btn" onclick="addToCart('${producto.id}')">Agregar al carrito</button>

          `;
          listaProductos.appendChild(div);
        }
      }
}
      
 
      
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

function showAlert() {
  const alertDiv = document.createElement("div");
  alertDiv.className = "alert alert-primary alert-fixed";
  alertDiv.setAttribute("role", "alert");
  alertDiv.textContent = "Su comida ha sido agregada correctamente al carrito";
  document.body.appendChild(alertDiv);
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}
