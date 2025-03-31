document.addEventListener("DOMContentLoaded", function () {
    const contenido = document.getElementById("datos");
    const botonToggle = document.getElementById("menutoggleCategorias");
    const menuCategorias = document.getElementById("categoriasResponsive");
    const menuCategoriasDesktop = document.getElementById("menu-categorias");

    if (!botonToggle || !menuCategorias || !menuCategoriasDesktop || !contenido) {
        console.error("Error: No se encontró el botón o los elementos necesarios");
        return;
    }

    function toggleMenu() {
        menuCategorias.classList.toggle("show");
    }

    botonToggle.addEventListener("click", toggleMenu);

    function agregarEstilosTabla() {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "stylejs.css"; // Archivo CSS con el nuevo diseño
        document.head.appendChild(link);
    }

    async function cargarJSON() {
        try {
            agregarEstilosTabla();
            const respuesta = await fetch("ListaDePrecios.json");
            if (!respuesta.ok) throw new Error("No se pudo cargar el archivo JSON");
            const datos = await respuesta.json();

            if (!Array.isArray(datos) || datos.length === 0) {
                throw new Error("El archivo JSON está vacío o tiene un formato incorrecto");
            }

            const categorias = [...new Set(datos.map(item => item.Categoria))];

            // Limpiar menús antes de agregar contenido
            menuCategorias.innerHTML = "";
            menuCategoriasDesktop.innerHTML = "";

            categorias.forEach(categoria => {
                const categoriaId = `categoria-${categoria.replace(/\s+/g, '-').toLowerCase()}`;

                // Enlace para menú mobile
                const enlace = document.createElement("a");
                enlace.href = `#${categoriaId}`;
                enlace.className = "categoria-link";
                enlace.textContent = categoria;
                menuCategorias.appendChild(enlace);

                // Enlace para menú de escritorio
                const enlaceDesktop = document.createElement("a");
                enlaceDesktop.href = `#${categoriaId}`;
                enlaceDesktop.className = "categoria-link";
                enlaceDesktop.textContent = categoria;
                menuCategoriasDesktop.appendChild(enlaceDesktop);
            });

            let html = `
                <table class="tabla-productos">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                        </tr>
                    </thead>`;

            categorias.forEach(categoria => {
                const productosFiltrados = datos.filter(item => item.Categoria === categoria);
                if (productosFiltrados.length > 0) {
                    const categoriaId = `categoria-${categoria.replace(/\s+/g, '-').toLowerCase()}`;
                    const imagenSrc = `assets/${categoria.toLowerCase().replace(/\s+/g, '-')}.png`;

                    html += `<tbody id="${categoriaId}">
                                <tr class="categoria-header">
                                    <th colspan="2">
                                        <img src="${imagenSrc}" alt="${categoria}" class="categoria-imagen">
                                        ${categoria}
                                    </th>
                                </tr>`;

                    productosFiltrados.forEach(item => {
                        html += `
                            <tr>
                                <td>${item.Nombre}</td>
                                <td class="precio">
                                    ${item.Precio ? `$${item.Precio}` :
                            (item.precio100gramos && item.preciokilo) ?
                                `$${item.precio100gramos} / 100g<br>$${item.preciokilo} / kg` :
                                `$${item.precio}`}
                                </td>
                            </tr>`;
                    });

                    html += `</tbody>`;
                }
            });

            html += `</table>`;
            contenido.innerHTML = html;

            document.querySelectorAll(".categoria-link").forEach(link => {
                link.addEventListener("click", function (e) {
                    e.preventDefault();
                    const destino = document.querySelector(this.getAttribute("href"));
                    if (destino) {
                        const headerHeight = document.querySelector("header").offsetHeight;
                        const offsetTop = destino.offsetTop - headerHeight + 400;

                        window.scrollTo({
                            top: offsetTop,
                            behavior: "smooth"
                        });

                        // Cierra el menú si está en modo responsive
                        menuCategorias.classList.remove("show");
                    }
                });
            });

        } catch (error) {
            contenido.innerHTML = `<p class="error-mensaje">Error al cargar los datos: ${error.message}</p>`;
        }
    }

    cargarJSON();
});
