if (sessionStorage.getItem("userId") === null) {
    location.href = "./inicio-sesion.html";
}

const formatHour = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const verifyStatus = (status) => {
    switch (status) {
        case "PENDING": return "Pendiente";
        case "CONFIRMED": return "Confirmado";
        case "DELIVERED": return "Entregado";
        case "CANCELLED": return "Cancelado";
        default: return "Desconocido";
    }
};

// Función que crea y muestra un modal con los detalles completos del pedido
const showOrderDetails = (order) => {
    const modal = document.createElement("div");
    modal.id = "order-modal";

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    // Generamos la lista de items utilizando "food_pedido"
    let itemsHtml = "";
    if(order.food_pedido && order.food_pedido.length > 0) {
        order.food_pedido.forEach(item => {
            itemsHtml += `
                <div style="display: flex; justify-content: start; align-items: center; gap: 10px; margin-bottom: 10px; height: 100%;">
                    <img src="${item.food.image}" alt="${item.food.name}" style="width:50px; height:50px; border-radius:5px;">
                    <div>
                        <p><strong>${item.food.name}</strong></p>
                        <p>Cantidad: ${item.quantity}</p>
                        <p>Precio: $${item.price}</p>
                    </div>
                </div>
            `;
        });
    } else {
        itemsHtml = "<p>No hay detalles de productos disponibles.</p>";
    }

    modalContent.innerHTML = `
           <div><h2>Orden N° ${order.number}</h2>
        <p>Status: ${verifyStatus(order.status)}</p>
        <p>Hora de retiro: ${formatHour(order.hour)}</p>
        <p>Total: $${order.total}</p>
        ${order.notes ? `<p>Notas: ${order.notes}</p>` : ""}
        </div>
        <div>
        <h3>Detalles del pedido:</h3>
        ${itemsHtml}
        
        <button id="close-modal" style="margin-top:10px; padding:10px; border:none; background:#193526; color:white; border-radius:5px; cursor:pointer;">Cerrar</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    document.getElementById("close-modal").addEventListener("click", () => {
        modal.remove();
    });
};

const showMenu = () => {
    location.href = "../selector/selector_food.html";
};

document.addEventListener("DOMContentLoaded", async () => {
    const ordersContainer = document.getElementById("orders");
    try {
        const response = await fetch("https://menta-backend.vercel.app/user/order/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "userId": sessionStorage.getItem("userId") })
        });
        const orders = await response.json();
        
        orders.data.forEach(order => {
            const orderElement = document.createElement("div");
            orderElement.classList.add("order");
            orderElement.innerHTML = `
                <div class="order-info">
                    <strong>Orden N° ${order.number}</strong>
                    <p class="order-status">(${verifyStatus(order.status)})</p>
                    <p>Hora de retiro: ${formatHour(order.hour)}</p>
                </div>
                <div>
                    <span>$${order.total}</span>
                    <img src="../images/arrow_go.svg" alt="order" width="50">
                </div>
            `;
            // Al hacer clic en el pedido se muestran los detalles completos
            orderElement.addEventListener("click", () => {
                console.log("Mostrar detalles de la orden", order);
                showOrderDetails(order);
            });
            ordersContainer.appendChild(orderElement);
            
        });
    } catch (error) {
        console.error("Error cargando órdenes:", error);
    }
});