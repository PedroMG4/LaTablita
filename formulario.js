document.addEventListener("DOMContentLoaded", function () {
    cargarDatos();
});

function cargarDatos() {
    fetch('ListaDePrecios.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar la lista de precios');
            }
            return response.json();
        })
        .then(productos => {
            const selectProducto = document.getElementById("id");
            const selectCategoria = document.getElementById("categoria");

            selectProducto.innerHTML = '<option value="">Nuevo Producto</option>';
            selectCategoria.innerHTML = '<option value="">Selecciona una categoría</option>';

            let categorias = new Set();

            productos.forEach(prod => {
                let id = prod.ID || `temp-${Math.random().toString(36).substr(2, 9)}`; 

                categorias.add(prod.Categoria);

                selectProducto.innerHTML += `<option value="${id}" 
                    data-nombre="${prod.Nombre}" 
                    data-categoria="${prod.Categoria}" 
                    data-precio="${prod.Precio || ''}" 
                    data-pesable="${prod.Pesable ? 'true' : 'false'}"
                    data-precio100="${prod.precio100gramos || ''}" 
                    data-preciokilo="${prod.preciokilo || ''}">
                    ${prod.Nombre}
                </option>`;
            });

            categorias.forEach(cat => {
                selectCategoria.innerHTML += `<option value="${cat}">${cat}</option>`;
            });
        })
        .catch(error => console.error("Error al cargar datos:", error));
}

function cargarProducto() {
    const select = document.getElementById("id");
    const selected = select.options[select.selectedIndex];

    document.getElementById("nombre").value = selected.getAttribute("data-nombre") || '';
    document.getElementById("categoria").value = selected.getAttribute("data-categoria") || '';
    document.getElementById("precio").value = selected.getAttribute("data-precio") || '';

    const esPesable = selected.getAttribute("data-pesable") === "true";
    document.getElementById("esPesable").checked = esPesable;
    togglePesableInputs();

    document.getElementById("precio100gramos").value = selected.getAttribute("data-precio100") || '';
    document.getElementById("preciokilo").value = selected.getAttribute("data-preciokilo") || '';
}

function eliminarProducto() {
    const id = document.getElementById("id").value;
    if (!id) {
        alert("Selecciona un producto para eliminar.");
        return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

    fetch('gestionar_producto.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'id': id, 'accion': 'eliminar' })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        if (data.exito) cargarDatos();
    })
    .catch(error => console.error("Error al eliminar:", error));
}

function togglePesableInputs() {
    const pesableInputs = document.getElementById("pesableInputs");
    const esPesable = document.getElementById("esPesable").checked;
    pesableInputs.style.display = esPesable ? "block" : "none";

    if (!esPesable) {
        document.getElementById("precio100gramos").value = '';
        document.getElementById("preciokilo").value = '';
    }
}