const socket = io();

socket.emit('mensajeCliente','Cliente conectado');

socket.on('mensajeServidor', (data) => {
    console.log(data);
});

const eliminarProducto = (productId) => {
    fetch(`/api/products/${productId}`, { method: "DELETE" })
            .then(response => response.json())
            .then(() => {
                const listaProductos = document.querySelector("ul");
                if (listaProductos.children.length === 0) {
                    const mensaje = document.createElement("p");
                    mensaje.textContent = "No hay productos disponibles.";
                    listaProductos.remove();
                    document.body.appendChild(mensaje); 
                }
            })
            .catch(error => console.error("Error al eliminar:", error));
}

const agregarProducto = (e) => {
    e.preventDefault();

    const nuevoProducto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        thumbnails: document.getElementById("thumbnails").value
    }

        fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto)
        })
        .then(response => response.json())
        .then(() => {
            document.getElementById("formAgregarProducto").reset();
        })
        .catch(error => console.error("Error:", error));
}

const formAgregarProducto = document.getElementById("formAgregarProducto");
formAgregarProducto.addEventListener("submit", agregarProducto);

socket.on('productoEliminado', (productId) => {
    const productoAEliminar = document.getElementById(`producto-${productId}`);
    if (!productoAEliminar) {
        return;
    }
    productoAEliminar.remove();
})

socket.on('productoCreado', (producto) => {
    let listaProductos = document.querySelector("ul");
    
    if (!listaProductos) {        
        const nuevaLista = document.createElement("ul");
        document.body.appendChild(nuevaLista);
        listaProductos = nuevaLista;
    }
    
    const mensajeVacio = document.querySelector("p");
    if (mensajeVacio && mensajeVacio.innerText === "No hay productos disponibles.") {
        mensajeVacio.remove();
    }

    const nuevoElemento = document.createElement("li");
    nuevoElemento.id = `producto-${producto.id}`;
    nuevoElemento.innerHTML = `
        ${producto.title} - $${producto.price} - Stock: ${producto.stock}
        <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
    `;

    listaProductos.appendChild(nuevoElemento);
});

