/* alertController.js */
/**
 * AlertController: Controlador para gestionar alertas usando SweetAlert2.
 * Facilita el manejo y actualización de errores, notificaciones, confirmaciones, etc.
 * 
 * Requiere incluir la librería SweetAlert2 en tu proyecto, por ejemplo:
 * <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
 *
 * Ejemplo de uso:
 *   // Mostrar alerta de error
 *   AlertController.showError("Ocurrió un error al procesar la solicitud.");
 *
 *   // Mostrar alerta de éxito
 *   AlertController.showSuccess("La operación se realizó correctamente.");
 *
 *   // Mostrar alerta de confirmación y ejecutar una acción al confirmar
 *   AlertController.showConfirmation("¿Deseas eliminar el negocio?", "Confirmación", () => {
 *       // Acción a ejecutar en caso de confirmación.
 *       eliminarNegocio();
 *   });
 */
class AlertController {
    /**
     * Muestra una alerta de error.
     * @param {string} message - Mensaje a mostrar.
     * @param {string} title - Título de la alerta (por defecto "Error").
     */
    static showError(message, title = 'Error') {
        Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            confirmButtonColor: '#d33'
        });
    }

    /**
     * Muestra una alerta de éxito.
     * @param {string} message - Mensaje a mostrar.
     * @param {string} title - Título de la alerta (por defecto "Éxito").
     */
    static showSuccess(message, title = 'Éxito') {
        Swal.fire({
            icon: 'success',
            title: title,
            text: message,
            confirmButtonColor: '#3085d6'
        });
    }

    /**
     * Muestra una alerta de confirmación y ejecuta un callback si se confirma.
     * @param {string} message - Mensaje a mostrar.
     * @param {string} title - Título de la alerta (por defecto "¿Estás seguro?").
     * @param {Function} callback - Función a ejecutar en caso de confirmación.
     */
    static showConfirmation(message, title = '¿Estás seguro?', callback) {
        Swal.fire({
            title: title,
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed && typeof callback === 'function') {
                callback();
            }
        });
    }

    /**
     * Muestra una alerta informativa.
     * @param {string} message - Mensaje a mostrar.
     * @param {string} title - Título de la alerta (por defecto "Información").
     */
    static showInfo(message, title = 'Información') {
        Swal.fire({
            icon: 'info',
            title: title,
            text: message,
            confirmButtonColor: '#3085d6'
        });
    }

    /**
     * Muestra una alerta de advertencia.
     * @param {string} message - Mensaje a mostrar.
     * @param {string} title - Título de la alerta (por defecto "Advertencia").
     */
    static showWarning(message, title = 'Advertencia') {
        Swal.fire({
            icon: 'warning',
            title: title,
            text: message,
            confirmButtonColor: '#f0ad4e'
        });
    }

    /**
     * Muestra una alerta específica para errores durante una actualización.
     * @param {string} message - Mensaje a mostrar.
     * @param {string} title - Título de la alerta (por defecto "Error de actualización").
     */
    static showUpdateError(message, title = 'Error de actualización') {
        Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            confirmButtonColor: '#d33'
        });
    }
}

// Exportar el controlador en entornos modulares (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlertController;
}
