let cartId = localStorage.getItem("cartId");

if (!cartId) {
    fetch(`/api/carts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: [] })
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            cartId = data.id;
            localStorage.setItem("cartId", cartId);
            console.log("Carrito creado con ID:", cartId);
        } else {
            console.error("No se recibió un ID de carrito válido", data);
        }
    })
    .catch(error => console.error("Error al crear carrito:", error));
}

const agregarAlCarrito = (productId) => {
    if (!cartId) {
       alert("No se ha creado un carrito.");
        return;
    }

    fetch(`/api/carts/${cartId}/product/${productId}`, { method: "POST" })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error("Error al agregar al carrito:", error));
}