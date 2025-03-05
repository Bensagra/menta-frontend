if (sessionStorage.getItem('userId')) {
  document.getElementById("user").style.display = "none";

}// Verificar que el usuario esté autenticado, si no, redirigir al inicio de sesión
    if (!sessionStorage.getItem("userId")) {
        window.location.href = "../sesion/inicio-sesion.html";
      }
      
      // Mostrar el número de pedido almacenado en sessionStorage
      try {
        const orderNumber = sessionStorage.getItem("number");
        const numberElement = document.getElementById("number");
        if (orderNumber) {
          numberElement.textContent += orderNumber;
        } else {
          numberElement.textContent += "No asignado";
        }
      } catch (error) {
        console.error("Error al obtener el número de pedido:", error);
        document.getElementById("number").textContent += "Error";
      }
  
      function volverAlInicio() {
        // Redirige al usuario a la página de inicio
        window.location.href = "../home/home.html";
      }