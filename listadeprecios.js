<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", function() {
    const contenido = document.getElementById("datos");
    const menuCategorias = document.getElementById("menu-categorias");

    if (!menuCategorias || !contenido) {
        console.error("Error: No se encontró el elemento 'menu-categorias' o 'datos'");
        return;
    }

=======
document.addEventListener("DOMContentLoaded", function () {
    const contenido = document.getElementById("datos");
    const botonToggle = document.getElementById("menutoggleCategorias");
    const menuCategorias = document.getElementById("categoriasResponsive");
    const menuCategoriasDesktop = document.getElementById("menu-categorias"); // ✅ nuevo

    if (!botonToggle || !menuCategorias || !menuCategoriasDesktop || !contenido) {
        console.error("Error: No se encontró el botón o los elementos necesarios");
        return;
    }

    function toggleMenu() {
        menuCategorias.classList.toggle("show");
    }

    botonToggle.addEventListener("click", toggleMenu);

>>>>>>> master
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
<<<<<<< HEAD
            menuCategorias.innerHTML = "";
            
            categorias.forEach(categoria => {
                const categoriaId = `categoria-${categoria.replace(/\s+/g, '-').toLowerCase()}`;
                const enlace = document.createElement("li");
                enlace.innerHTML = `<a href="#${categoriaId}" class="categoria-link">${categoria}</a>`;
                menuCategorias.appendChild(enlace);
=======

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
>>>>>>> master
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
<<<<<<< HEAD
                    
=======

>>>>>>> master
                    html += `<tbody id="${categoriaId}">
                                <tr class="categoria-header">
                                    <th colspan="2">
                                        <img src="${imagenSrc}" alt="${categoria}" class="categoria-imagen">
                                        ${categoria}
                                    </th>
                                </tr>`;
<<<<<<< HEAD
        
=======

>>>>>>> master
                    productosFiltrados.forEach(item => {
                        html += `
                            <tr>
                                <td>${item.Nombre}</td>
                                <td class="precio">
<<<<<<< HEAD
                                    ${item.Precio ? `$${item.Precio}` : 
                                    (item.precio100gramos && item.preciokilo) ? 
                                    `$${item.precio100gramos} / 100g<br>$${item.preciokilo} / kg` : 
=======
                                    ${item.Precio ? `$${item.Precio}` :
                                (item.precio100gramos && item.preciokilo) ?
                                    `$${item.precio100gramos} / 100g<br>$${item.preciokilo} / kg` :
>>>>>>> master
                                    `$${item.precio}`}
                                </td>
                            </tr>`;
                    });
<<<<<<< HEAD
=======

>>>>>>> master
                    html += `</tbody>`;
                }
            });

            html += `</table>`;
            contenido.innerHTML = html;

            document.querySelectorAll(".categoria-link").forEach(link => {
<<<<<<< HEAD
                link.addEventListener("click", function(e) {
=======
                link.addEventListener("click", function (e) {
>>>>>>> master
                    e.preventDefault();
                    const destino = document.querySelector(this.getAttribute("href"));
                    if (destino) {
                        const headerHeight = document.querySelector("header").offsetHeight;
<<<<<<< HEAD
                        const offsetTop = destino.offsetTop - headerHeight+400;
=======
                        const offsetTop = destino.offsetTop - headerHeight + 400;
>>>>>>> master

                        window.scrollTo({
                            top: offsetTop,
                            behavior: "smooth"
                        });
<<<<<<< HEAD
=======

                        // Cierra el menú si está en modo responsive
                        menuCategorias.classList.remove("show");
>>>>>>> master
                    }
                });
            });

        } catch (error) {
            contenido.innerHTML = `<p class="error-mensaje">Error al cargar los datos: ${error.message}</p>`;
        }
    }

    cargarJSON();
});
