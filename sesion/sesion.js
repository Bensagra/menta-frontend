if (sessionStorage.getItem("login-register") == 1 || sessionStorage.getItem("login-register") == null) {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("register-form").style.display = "none";
    document.getElementById("form-title").innerText = "Inicio de sesión";
} else if (sessionStorage.getItem("login-register") == 2) {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
    document.getElementById("form-title").innerText = "Registro";
    
} else {
    
}
document.getElementById("toggle-register").addEventListener("click", function() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
    document.getElementById("form-title").innerText = "Registro";
    document.getElementById("error").innerText = "";
    document.getElementById("email").innerText = "";
    document.getElementById("password").innerText = "";
});

document.getElementById("toggle-login").addEventListener("click", function() {
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
    document.getElementById("form-title").innerText = "Inicio de sesión";
    document.getElementById("error").innerText = "";
    document.getElementById("phone").innerText = "";
    document.getElementById("name").innerText = "";
    document.getElementById("surname").innerText = "";
    document.getElementById("reg-email").innerText = "";
    document.getElementById("reg-password").innerText = "";

});
document.getElementById("register-btn").addEventListener("click", async function() {
    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const errorElement = document.getElementById("reg-error");
    const btn = document.getElementById("register-btn");

    // Limpiar mensaje de error
    errorElement.innerText = "";

    // Validación simple de los campos
    if (!email || !password || !name || !surname || !phone) {
        errorElement.innerText = "Todos los campos son obligatorios.";
        return;
    }

    // Deshabilitar el botón mientras se hace la petición
    btn.disabled = true;
    btn.innerText = "Cargando...";

    try {
        const response = await fetch("https://menta-backend.vercel.app/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, name, surname, phone })
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Credenciales incorrectas.");
            } else {
                throw new Error("Error en el servidor, intente más tarde.");
            }
        }
        let user = await response.json();
        console.log(user);
        sessionStorage.setItem("userId", user.user.id);
        window.location.href = "../home/home.html";
    } catch (error) {
        errorElement.innerText = error.message;
    } finally {
        btn.disabled = false;
        btn.innerText = "Registrarse";
    }
});

function togglePassword(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
      input.type = "text";
      iconElement.innerHTML = '<i class="fa fa-eye-slash"></i>';
    } else {
      input.type = "password";
      iconElement.innerHTML = '<i class="fa fa-eye"></i>';
    }
  }
  


document.getElementById("btn").addEventListener("click", async function() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorElement = document.getElementById("error");
    const btn = document.getElementById("btn");

    // Limpiar mensaje de error
    errorElement.innerText = "";

    // Validación simple de los campos
    if (!email || !password) {
        errorElement.innerText = "Todos los campos son obligatorios.";
        return;
    }

    // Deshabilitar el botón mientras se hace la petición
    btn.disabled = true;
    btn.innerText = "Cargando...";

    try {
        const response = await fetch("https://menta-backend.vercel.app/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Credenciales incorrectas.");
            } else {
                throw new Error("Error en el servidor, intente más tarde.");
            }
        }
        let user = await response.json();
        sessionStorage.setItem("userId", user.user.id);
        window.location.href = "../home/home.html";
    } catch (error) {
        errorElement.innerText = error.message;
    } finally {
        btn.disabled = false;
        btn.innerText = "Iniciar sesión";
    }
});