if (sessionStorage.getItem('userId')) {
    document.getElementById("user").style.display = "none";
  
}
if (sessionStorage.getItem("userId") === null) {
    location.href = "../sesion/inicio-sesion.html";
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


  updateCartCounter();