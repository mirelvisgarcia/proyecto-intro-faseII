const usuarios = [
    { nombre: "dancabello", password: "J5*asdRD.s", rol: "vendedor", correo: "dancabello@gmail.com" },
    { nombre: "seller456", password: "Intro123", rol: "comprador" },
    { nombre: "root", password: "dochouse", rol: "administrador" }
];

document.addEventListener("DOMContentLoaded", () => {
    
    if (document.getElementById("loginForm")) {
        document.getElementById("loginForm").addEventListener("submit", (event) => {
            event.preventDefault();

            const nombre = document.getElementById("nombre").value;
            const password = document.getElementById("password").value;
            
            
            const usuario = usuarios.find(u => u.nombre === nombre && u.password === password);

            if (usuario) {
                
                localStorage.setItem("usuario", JSON.stringify(usuario));

                // Abre la página correspondiente según el rol
                switch (usuario.rol) {
                    case "vendedor":
                        window.location.href = "vendedor.html";
                        break;
                    case "comprador":
                        window.location.href = "comprador.html";
                        break;
                    case "administrador":
                        window.location.href = "administrador.html";
                        break;
                    default:
                        break;
                }
            } else {
                // Si no se encuentra al usuario, muestra un aviso
                document.getElementById("mensaje-error").textContent = "Usuario no registrado";
            }
        });
    }
});

const productos = [];


function mostrarProductosVendedor() {
    const productosContainer = document.getElementById("productos-vendedor");
    productosContainer.innerHTML = ""; 

    if (productos.length === 0) {
        productosContainer.innerHTML = "<p>No tienes productos agregados.</p>";
    } else {
        productos.forEach(producto => {
            const productoElement = document.createElement("div");
            productoElement.classList.add("producto");

            const imagen = producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}" width="100">` : "";
            const productoInfo = `
                <h4>${producto.nombre}</h4>
                <p>Costo: $${producto.costo}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                ${imagen}
            `;

            productoElement.innerHTML = productoInfo;
            productosContainer.appendChild(productoElement);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    
    if (usuario && usuario.rol === "vendedor") {
        // Mostrar la información del vendedor
        document.getElementById("nombre-vendedor").textContent = `Nombre: ${usuario.nombre}`;
        document.getElementById("correo-vendedor").textContent = `Correo: ${usuario.correo}`;

        // Cargar los productos del vendedor 
        const productosVendedor = JSON.parse(localStorage.getItem("productos")) || [];
        productos.push(...productosVendedor);
        mostrarProductosVendedor();

        // Agregar un nuevo producto
        document.getElementById("form-producto").addEventListener("submit", (event) => {
            event.preventDefault();

            const nombreProducto = document.getElementById("nombre-producto").value;
            const costoProducto = parseFloat(document.getElementById("costo-producto").value);
            const cantidadProducto = parseInt(document.getElementById("cantidad-producto").value);
            const imagenProducto = document.getElementById("imagen-producto").files[0];

            const reader = new FileReader();
            reader.onloadend = function () {
                const producto = {
                    nombre: nombreProducto,
                    costo: costoProducto,
                    cantidad: cantidadProducto,
                    imagen: reader.result 
                };

                productos.push(producto);
                localStorage.setItem("productos", JSON.stringify(productos));

                // Limpiar el formulario
                document.getElementById("form-producto").reset();

                // Actualizar la lista de productos
                mostrarProductosVendedor();
            };
            
            if (imagenProducto) {
                reader.readAsDataURL(imagenProducto);
            } else {
                const producto = {
                    nombre: nombreProducto,
                    costo: costoProducto,
                    cantidad: cantidadProducto,
                    imagen: null
                };

                productos.push(producto);
                localStorage.setItem("productos", JSON.stringify(productos));

                document.getElementById("form-producto").reset();

                mostrarProductosVendedor();
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Mostrar productos disponibles
    const productosContainer = document.getElementById("productos-disponibles"); 

    productos.forEach((producto, index) => {
        const productoElement = document.createElement("div");
        productoElement.classList.add("producto");

        const imagen = producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}">` : "";
        const productoInfo = `
            <h4>${producto.nombre}</h4>
            <p>Costo: $${producto.costo}</p>
            <p>Cantidad disponible: ${producto.cantidad}</p>
            ${imagen}
            <label>
                Seleccionar
                <input type="checkbox" class="checkbox-producto" data-index="${index}" ${carrito.some(p => p.index === index) ? 'checked' : ''}>
            </label>
        `;
        
        productoElement.innerHTML = productoInfo;
        productosContainer.appendChild(productoElement);
    });

    // Actualizar carrito
    function actualizarCarrito() {
        const carritoContainer = document.getElementById("productos-carrito");
        carritoContainer.innerHTML = "";
        let total = 0;

        carrito.forEach((producto) => {
            const productoElement = document.createElement("div");
            productoElement.classList.add("producto");
            productoElement.innerHTML = `
                <h4>${producto.nombre}</h4>
                <p>Costo: $${producto.costo}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                <button class="eliminar-producto" data-index="${producto.index}">Eliminar</button>
            `;
            carritoContainer.appendChild(productoElement);
            total += producto.costo * producto.cantidad;
        });

        document.getElementById("total-carrito").textContent = `Total: $${total.toFixed(2)}`;
    }
    

    // Función para mostrar vendedores y sus productos
    function mostrarVendedores() {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const vendedores = usuarios.filter(u => u.rol === "vendedor");

        gestionVendedores.innerHTML = ""; 

        vendedores.forEach((vendedor, index) => {
            const divVendedor = document.createElement("div");
            divVendedor.classList.add("vendedor");

            let productosHtml = "";
            vendedor.productos.forEach((producto, pIndex) => {
                productosHtml += `
                    <div>
                        <p><strong>${producto.nombre}</strong> - $${producto.costo} - Cantidad: ${producto.cantidad}</p>
                        <button onclick="eliminarProducto(${index}, ${pIndex})">Eliminar Producto</button>
                    </div>
                `;
            });

            divVendedor.innerHTML = `
                <h4>${vendedor.nombre}</h4>
                <div>${productosHtml}</div>
                <button onclick="eliminarVendedor(${index})">Eliminar Vendedor</button>
            `;
            gestionVendedores.appendChild(divVendedor);
        });
    }

    
    document.getElementById("productos-disponibles").addEventListener("change", (event) => {
        if (event.target.classList.contains("checkbox-producto")) {
            const productoIndex = event.target.dataset.index;
            const producto = productos[productoIndex];

            // Si el checkbox está marcado, agregar al carrito
            if (event.target.checked) {
                const productoEnCarrito = carrito.find(p => p.index === productoIndex);
                if (!productoEnCarrito) {
                    carrito.push({ ...producto, index: productoIndex, cantidad: 1 });
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    actualizarCarrito();
                }
            } else {
                // Si el checkbox está desmarcado, eliminar del carrito
                const carritoIndex = carrito.findIndex(p => p.index === productoIndex);
                if (carritoIndex !== -1) {
                    carrito.splice(carritoIndex, 1);
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    actualizarCarrito();
                }
            }
        }
    });

    // Función para mostrar el carrito flotante
    document.getElementById("ver-carrito").addEventListener("click", () => {
        document.getElementById("carrito").style.display = "block";
        actualizarCarrito();
    });

    // Función para cerrar el carrito
    document.getElementById("cerrar-carrito").addEventListener("click", () => {
        document.getElementById("carrito").style.display = "none";
    });

    // Función para vaciar el carrito
    document.getElementById("vaciar-carrito").addEventListener("click", () => {
        localStorage.setItem("carrito", JSON.stringify([]));
        carrito.length = 0; // Limpiar el carrito local
        actualizarCarrito();
    });

    // Eliminar un producto del carrito
    document.getElementById("productos-carrito").addEventListener("click", (event) => {
        if (event.target.classList.contains("eliminar-producto")) {
            const productoIndex = event.target.dataset.index;
            const carritoIndex = carrito.findIndex(p => p.index === productoIndex);
            if (carritoIndex !== -1) {
                carrito.splice(carritoIndex, 1);
                localStorage.setItem("carrito", JSON.stringify(carrito));
                actualizarCarrito();

                // Desmarcar el checkbox en los productos disponibles
                const checkbox = document.querySelector(`.checkbox-producto[data-index="${productoIndex}"]`);
                if (checkbox) checkbox.checked = false;
            }
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    
    function cerrarSesion() {
    
        localStorage.removeItem("usuario");

    
        window.location.href = "inicio_sesion.html";
    }

    
    const cerrarSesionBtn = document.getElementById("cerrar-sesion");
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener("click", cerrarSesion);
    }

    // Función para manejar la página del comprador
    if (usuario && usuario.rol === "comprador") {
        // Mostrar productos disponibles, carrito de compras.
        const productos = JSON.parse(localStorage.getItem("productos")) || [];
        const productosContainer = document.getElementById("productos-disponibles");
        productos.forEach((producto, index) => {
            const productoElement = document.createElement("div");
            productoElement.classList.add("producto");
            
            const imagen = producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}">` : "";
            productoElement.innerHTML = `
                <h4>${producto.nombre}</h4>
                <p>Costo: $${producto.costo}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                ${imagen}
                <label>
                    Seleccionar
                    <input type="checkbox" class="checkbox-producto" data-index="${index}">
                </label>
            `;
            productosContainer.appendChild(productoElement);
        });
    }

    // Función para manejar la página del vendedor
    if (usuario && usuario.rol === "vendedor") {
        // Mostrar productos, formulario de agregar productos, etc.
    }

    // Función para manejar la página del administrador
    if (usuario && usuario.rol === "administrador") {
        // Mostrar información de vendedores, productos, etc.
    }
});


document.getElementById('pagar').addEventListener('click', function() {
    // Mostrar el formulario flotante mensaje al oprimir boton pagar
    document.getElementById('formularioFlotante').style.display = 'block';
});

document.getElementById('cerrar').addEventListener('click', function() {
    // Ocultar el formulario flotante
    document.getElementById('formularioFlotante').style.display = 'none';
});





// Función para mostrar vendedores y sus productos
function mostrarVendedores() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const vendedores = usuarios.filter(u => u.rol === "vendedor");

    const gestionVendedores = document.getElementById("gestion-vendedores");
    gestionVendedores.innerHTML = ""; // Limpiar el contenido anterior

    vendedores.forEach((vendedor, index) => {
        const divVendedor = document.createElement("div");
        divVendedor.classList.add("vendedor");

        let productosHtml = "";
        vendedor.productos.forEach((producto, pIndex) => {
            productosHtml += `
                <div>
                    <p><strong>${producto.nombre}</strong> - $${producto.costo} - Cantidad: ${producto.cantidad}</p>
                    <button onclick="eliminarProducto(${index}, ${pIndex})">Eliminar Producto</button>
                </div>
            `;
        });

        divVendedor.innerHTML = `
            <h4>${vendedor.nombre}</h4>
            <div>${productosHtml}</div>
            <button onclick="eliminarVendedor(${index})">Eliminar Vendedor</button>
        `;
        gestionVendedores.appendChild(divVendedor);
    });
}

// Función para eliminar un producto de un vendedor
function eliminarProducto(indexVendedor, indexProducto) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const vendedor = usuarios[indexVendedor];

    if (vendedor && vendedor.productos) {
        vendedor.productos.splice(indexProducto, 1); // Eliminar el producto
        localStorage.setItem("usuarios", JSON.stringify(usuarios)); // Actualizar localStorage
        mostrarVendedores(); // Actualizar la vista
    }
}

// Función para eliminar un vendedor
function eliminarVendedor(indexVendedor) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.splice(indexVendedor, 1); // Eliminar el vendedor
    localStorage.setItem("usuarios", JSON.stringify(usuarios)); // Actualizar localStorage
    mostrarVendedores(); // Actualizar la vista
}

// Ejecutar la función al cargar la página
window.onload = mostrarVendedores;