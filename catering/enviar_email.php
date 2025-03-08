<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recoger y limpiar los datos del formulario
    $nombre = htmlspecialchars(trim($_POST["nombre"]));
    $mensaje = htmlspecialchars(trim($_POST["mensaje"]));

    // Configuración del correo
    $destinatario = "bensagra@gmail.com"; // Cambia por el correo de destino
    $asunto = "Nuevo mensaje de contacto";
    
    // Componer el cuerpo del mensaje
    $cuerpo = "Nombre: " . $nombre . "\n";
    $cuerpo .= "Mensaje: " . $mensaje . "\n";

    // Cabeceras del correo (personaliza 'From' según tu dominio)
    $cabeceras = "From: no-reply@tudominio.com\r\n";
    $cabeceras .= "Reply-To: no-reply@tudominio.com\r\n";

    // Enviar el correo y mostrar mensaje según resultado
    if (mail($destinatario, $asunto, $cuerpo, $cabeceras)) {
        echo "El mensaje se ha enviado correctamente.";
    } else {
        echo "Hubo un error al enviar el mensaje.";
    }
} else {
    // Si no es POST, se muestra el formulario
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Contacto</title>
    </head>
    <body>
        <h1>Formulario de Contacto</h1>
        <form action="" method="POST">
            <label for="nombre">Nombre:</label><br>
            <input type="text" id="nombre" name="nombre" required><br><br>
            <label for="mensaje">Mensaje:</label><br>
            <textarea id="mensaje" name="mensaje" required></textarea><br><br>
            <input type="submit" value="Enviar">
        </form>
    </body>
    </html>
    <?php
}
?>