<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

function responderJSON($mensaje, $exito = false) {
    echo json_encode(["exito" => $exito, "mensaje" => $mensaje], JSON_UNESCAPED_UNICODE);
    exit();
}

$archivo_json = 'ListaDePrecios.json';

// Cargar datos existentes
$datos = [];
if (file_exists($archivo_json)) {
    $contenido = file_get_contents($archivo_json);
    $datos = json_decode($contenido, true) ?: [];
}

// Si la solicitud es POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $accion = $_POST['accion'] ?? '';

    if ($accion === 'eliminar') {
        $id = $_POST['id'] ?? '';
        if (!$id) {
            responderJSON("Error: ID de producto no proporcionado.");
        }

        // Filtrar productos y verificar si existía
        $productos_filtrados = array_values(array_filter($datos, function ($producto) use ($id) {
            return isset($producto['ID']) && $producto['ID'] !== $id;
        }));

        if (count($productos_filtrados) === count($datos)) {
            responderJSON("Error: Producto no encontrado.");
        }

        // Guardar cambios en JSON
        if (file_put_contents($archivo_json, json_encode($productos_filtrados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
            responderJSON("Error al eliminar el producto.");
        }

        responderJSON("Producto eliminado correctamente", true);
    }

    // **Corrección en la asignación de ID**
    $id = $_POST['id'] ?? null;
    if (!$id) {
        $id = uniqid("prod-", true); // Genera un ID único si no se recibe uno
    }

    // Variables del producto a guardar/modificar
    $nombre = trim($_POST['nombre'] ?? '');
    $categoria = trim($_POST['categoria'] ?? '');
    $esPesable = isset($_POST['esPesable']) && $_POST['esPesable'] === "true";

    $precio = isset($_POST['precio']) && $_POST['precio'] !== '' ? floatval($_POST['precio']) : null;
    $precio100gramos = isset($_POST['precio100gramos']) && $_POST['precio100gramos'] !== '' ? floatval($_POST['precio100gramos']) : null;
    $preciokilo = isset($_POST['preciokilo']) && $_POST['preciokilo'] !== '' ? floatval($_POST['preciokilo']) : null;

    // Si el producto tiene precio por peso, se marca como pesable
    if ($precio100gramos !== null || $preciokilo !== null) {
        $esPesable = true;
    }

    if (empty($nombre)) {
        responderJSON("Error: El nombre del producto no puede estar vacío.");
    }

    // **Corrección en la verificación del ID antes de acceder a él**
    $productoExistente = false;
    foreach ($datos as &$producto) {
        if (isset($producto['ID']) && $producto['ID'] === $id) {
            // Actualizar producto existente
            $producto['Nombre'] = $nombre;
            $producto['Categoria'] = $categoria;
            $producto['Pesable'] = $esPesable;
            $producto['Precio'] = $precio;
            $producto['precio100gramos'] = $precio100gramos;
            $producto['preciokilo'] = $preciokilo;
            $productoExistente = true;
            break;
        }
    }

    // Si no existe, agregar nuevo
    if (!$productoExistente) {
        $datos[] = [
            "ID" => $id,
            "Nombre" => $nombre,
            "Categoria" => $categoria,
            "Pesable" => $esPesable,
            "Precio" => $precio,
            "precio100gramos" => $precio100gramos,
            "preciokilo" => $preciokilo
        ];
    }

    // Guardar cambios en JSON
    if (file_put_contents($archivo_json, json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
        responderJSON("Error al guardar los datos.");
    }

    responderJSON("Producto guardado correctamente", true);
    header("Location: formularioproducto.html");
}

// Redirigir si no es una petición válida
header("Location: formularioproducto.html");
exit();
?>
