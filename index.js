if (sessionStorage.getItem('userId')) {
    document.getElementById("user").style.display = "none";
  
}
async function fetchCategories() {
try {
    document.getElementById('loadingOverlay').style.display = 'flex';
    const response = await fetch('https://menta-backend.vercel.app/food'); // Reemplaza con la URL correcta
    const data = await response.json();
    
    if (data.valid) {
        generateButtons(data.data);
        document.getElementById('loadingOverlay').style.display = 'none';
    }
} catch (error) {
    console.error('Error fetching data:', error);
}
}

function generateButtons(categories) {
const container = document.getElementById('botonera');
container.innerHTML = '';

const selectedCategories = categories.sort(() => 0.5 - Math.random()).slice(0, 6);

selectedCategories.forEach(category => {
    const div = document.createElement('div');
    div.classList.add('boton');
    div.setAttribute('onclick', `comprar('${JSON.stringify(category)}')`);
    
    const img = document.createElement('img');
    img.style.objectFit = 'contain';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.src = category.img;
    img.alt = category.name;
    
    const h3 = document.createElement('h3');
    h3.textContent = category.name;
    
    const button = document.createElement('button');
    button.textContent = 'COMPRAR';
    
    div.appendChild(img);
    div.appendChild(h3);
    div.appendChild(button);
    container.appendChild(div);
});
}

// Ejecutar la función al cargar la página
window.onload = fetchCategories;

$(document).ready(function () {
  if ($(window).width() < 992) {
    $('.dropdown').off('mouseenter mouseleave'); // Desactiva hover en móviles
    $('.dropdown-toggle').click(function () {
      var $dropdownMenu = $(this).next('.dropdown-menu');
      $('.dropdown-menu').not($dropdownMenu).removeClass('show'); // Cierra otros dropdowns abiertos
      $dropdownMenu.toggleClass('show');
    });
  }
});

function comprar(name) {
    sessionStorage.setItem("name", name);
    location.href = "productos.html";

    
}