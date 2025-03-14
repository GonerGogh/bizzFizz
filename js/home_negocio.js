document.addEventListener('DOMContentLoaded', function() {
    // Ejemplo de datos simulados (incluye estado, likes, compartidos, ubicacion)
    const datosNegocio = {
        id: 1,
        nombre: 'Mi Negocio',
        categoriaServicio: 'Restaurante',
        calle: 'Av. Principal',
        colonia: 'Centro',
        ciudad: 'Ciudad de México',
        codigoPostal: '06000',
        numeroContacto: '555-123-4567',
        numeroWhatsApp: '555-987-6543',
        foto: 'perfil.jpg',
        publicaciones: [
            {
                id: 1,
                titulo: 'Oferta Especial',
                descripcion: 'Descuentos del 30% en todos nuestros productos durante este fin de semana.',
                imagen: 'oferta.jpg',
                precio: '$99.99',
                ubicacion: 'Centro, Ciudad de México',
                estado: 'Activo',
                likes: 15,
                compartidos: 3
            },
            {
                id: 2,
                titulo: 'Nuevo Producto',
                descripcion: 'Conoce nuestro nuevo lanzamiento disponible a partir de la próxima semana.',
                imagen: 'producto.jpg',
                precio: '$149.99',
                ubicacion: 'Ciudad de México',
                estado: 'Inactivo',
                likes: 8,
                compartidos: 1
            }
        ]
    };

    // Elementos del DOM
    const logoUsuario = document.getElementById('logoUsuario');
    const sidebarPerfil = document.getElementById('sidebarPerfil');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const btnCerrarSidebar = document.getElementById('btnCerrarSidebar');
    const btnGuardarCambios = document.getElementById('btnGuardarCambios');
    const btnEliminarCuenta = document.getElementById('btnEliminarCuenta');
    const btnCrearPublicacion = document.getElementById('btnCrearPublicacion');
    const inputBuscar = document.getElementById('inputBuscar');

    // Inicialización
    inicializarApp();

    function inicializarApp() {
        cargarPublicaciones();
        cargarDatosNegocio();
        configurarEventListeners();
    }

    function configurarEventListeners() {
        // Mostrar/ocultar sidebar de perfil
        logoUsuario.addEventListener('click', mostrarSidebarPerfil);
        btnCerrarSidebar.addEventListener('click', ocultarSidebarPerfil);
        sidebarOverlay.addEventListener('click', ocultarSidebarPerfil);

        // Crear nueva publicación
        btnCrearPublicacion.addEventListener('click', mostrarPopupCrearPublicacion);

        // Guardar cambios en el perfil
        btnGuardarCambios.addEventListener('click', guardarCambiosNegocio);

        // Eliminar cuenta
        btnEliminarCuenta.addEventListener('click', mostrarConfirmacionEliminarCuenta);

        // Búsqueda simulada
        inputBuscar.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                buscarNegocio(inputBuscar.value);
            }
        });
    }

    // Sidebar
    function mostrarSidebarPerfil() {
        sidebarPerfil.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function ocultarSidebarPerfil() {
        sidebarPerfil.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Cargar datos del negocio en el sidebar
    function cargarDatosNegocio() {
        document.getElementById('categoriaServicio').value = datosNegocio.categoriaServicio || '';
        document.getElementById('calle').value = datosNegocio.calle || '';
        document.getElementById('colonia').value = datosNegocio.colonia || '';
        document.getElementById('ciudad').value = datosNegocio.ciudad || '';
        document.getElementById('codigoPostal').value = datosNegocio.codigoPostal || '';
        document.getElementById('numeroContacto').value = datosNegocio.numeroContacto || '';
        document.getElementById('numeroWhatsApp').value = datosNegocio.numeroWhatsApp || '';
    }

    // Cargar y mostrar publicaciones en el panel
    function cargarPublicaciones() {
        const contenedorPublicaciones = document.getElementById('contenedorPublicaciones');
        contenedorPublicaciones.innerHTML = '';

        datosNegocio.publicaciones.forEach(pub => {
            const publicacionHTML = crearElementoPublicacion(pub);
            contenedorPublicaciones.appendChild(publicacionHTML);
        });
    }

    function crearElementoPublicacion(publicacion) {
        // Crear estructura de tarjeta
        const divPublicacion = document.createElement('div');
        divPublicacion.className = 'col-12 tarjeta-publicacion';

        divPublicacion.innerHTML = `
            <div class="encabezado-publicacion">
                <h3 class="titulo-publicacion">${publicacion.titulo}</h3>
            </div>
            <div class="cuerpo-publicacion">
                <div class="contenedor-imagen">
                    ${
                        publicacion.imagen
                        ? `<img src="${publicacion.imagen}" alt="${publicacion.titulo}" class="img-fluid">`
                        : `<div class="placeholder-imagen">Sin imagen</div>`
                    }
                </div>
                <div class="contenedor-detalles">
                    <div class="descripcion-publicacion">${publicacion.descripcion}</div>
                    <div class="footer-publicacion">
                        <div class="ubicacion-publicacion"><i class="fa fa-map-marker-alt"></i> ${publicacion.ubicacion}</div>
                        <div class="precio-publicacion">${publicacion.precio}</div>
                    </div>
                    <div class="mt-2">
                        <span class="badge bg-${
                          publicacion.estado === 'Activo' ? 'success' : 'secondary'
                        }">${publicacion.estado}</span>
                        <span class="ms-3"><i class="fa fa-heart"></i> ${publicacion.likes} likes</span>
                        <span class="ms-3"><i class="fa fa-share"></i> ${publicacion.compartidos} compartidos</span>
                    </div>
                </div>
            </div>
            <div class="acciones-publicacion">
                <button class="btn-editar" data-id="${publicacion.id}" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn-eliminar" data-id="${publicacion.id}" title="Eliminar"><i class="fas fa-trash"></i></button>
            </div>
        `;

        // Eventos para editar y eliminar
        const btnEditar = divPublicacion.querySelector('.btn-editar');
        const btnEliminar = divPublicacion.querySelector('.btn-eliminar');

        btnEditar.addEventListener('click', () => editarPublicacion(publicacion.id));
        btnEliminar.addEventListener('click', () => eliminarPublicacion(publicacion.id));

        return divPublicacion;
    }

    // Guardar cambios del perfil
    function guardarCambiosNegocio() {
        datosNegocio.categoriaServicio = document.getElementById('categoriaServicio').value;
        datosNegocio.calle = document.getElementById('calle').value;
        datosNegocio.colonia = document.getElementById('colonia').value;
        datosNegocio.ciudad = document.getElementById('ciudad').value;
        datosNegocio.codigoPostal = document.getElementById('codigoPostal').value;
        datosNegocio.numeroContacto = document.getElementById('numeroContacto').value;
        datosNegocio.numeroWhatsApp = document.getElementById('numeroWhatsApp').value;

        // Aquí iría la lógica de actualización en el servidor

        AlertController.showSuccess('Los datos de tu negocio han sido actualizados correctamente.', 'Cambios guardados');
        cargarPublicaciones();
        ocultarSidebarPerfil();
    }

    // Confirmación y eliminación de cuenta
    function mostrarConfirmacionEliminarCuenta() {
        AlertController.showConfirmation(
            "Esta acción no se puede deshacer. Todos tus datos y publicaciones serán eliminados.",
            "¿Estás seguro?",
            () => {
                // Lógica para eliminar la cuenta
                Swal.fire('Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente.', 'success')
                .then(() => {
                    // Redirige a la página de inicio
                    window.location.href = '../index.html';
                });
            }
        );
    }

    // Pop up para crear nueva publicación (Registro)
    function mostrarPopupCrearPublicacion() {
        Swal.fire({
            title: 'Crear Publicación',
            html: `
                <div class="form-group mb-2">
                    <label>Título</label>
                    <input type="text" id="swal-titulo" class="form-control" placeholder="Título" />
                </div>
                <div class="form-group mb-2">
                    <label>Descripción</label>
                    <textarea id="swal-descripcion" class="form-control" placeholder="Descripción"></textarea>
                </div>
                <div class="form-group mb-2">
                    <label>Precio</label>
                    <input type="text" id="swal-precio" class="form-control" placeholder="Precio" />
                </div>
                <div class="form-group mb-2">
                    <label>Ubicación</label>
                    <input type="text" id="swal-ubicacion" class="form-control" placeholder="Ubicación" />
                </div>
                <div class="form-group mb-2">
                    <label>Imagen</label>
                    <input type="file" id="swal-imagen" class="form-control" />
                </div>
                <div class="form-group mb-2">
                    <label>Estado</label>
                    <select id="swal-estado" class="form-control">
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Publicar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'border border-primary shadow-lg'
            },
            preConfirm: () => {
                const titulo = document.getElementById('swal-titulo').value.trim();
                const descripcion = document.getElementById('swal-descripcion').value.trim();
                const precio = document.getElementById('swal-precio').value.trim();
                const ubicacion = document.getElementById('swal-ubicacion').value.trim();
                const estado = document.getElementById('swal-estado').value;
                const imagenInput = document.getElementById('swal-imagen');
                
                if (!titulo || !descripcion || !precio || !ubicacion) {
                    AlertController.showError("Todos los campos marcados son obligatorios (Título, Descripción, Precio, Ubicación).");
                    return false;
                }

                // Para simplificar, tomamos solo el nombre del archivo (sin subirlo al servidor)
                let nombreArchivo = '';
                if (imagenInput.files && imagenInput.files.length > 0) {
                    nombreArchivo = imagenInput.files[0].name;
                }

                return { titulo, descripcion, precio, ubicacion, estado, nombreArchivo };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const { titulo, descripcion, precio, ubicacion, estado, nombreArchivo } = result.value;

                const nuevaPublicacion = {
                    id: datosNegocio.publicaciones.length + 1,
                    titulo,
                    descripcion,
                    precio,
                    ubicacion,
                    estado,
                    imagen: nombreArchivo || 'placeholder.jpg',
                    likes: 0,
                    compartidos: 0
                };

                // Agregar al inicio del array
                datosNegocio.publicaciones.unshift(nuevaPublicacion);
                cargarPublicaciones();
                AlertController.showSuccess("Publicación creada exitosamente.", "Creada");
            }
        });
    }

    // Pop up para editar publicación (Editar)
    function editarPublicacion(id) {
        const publicacion = datosNegocio.publicaciones.find(pub => pub.id === id);
        if (!publicacion) return;

        Swal.fire({
            title: 'Editar Publicación',
            html: `
                <div class="form-group mb-2">
                    <label>Título</label>
                    <input type="text" id="swal-titulo" class="form-control" value="${publicacion.titulo}" />
                </div>
                <div class="form-group mb-2">
                    <label>Descripción</label>
                    <textarea id="swal-descripcion" class="form-control">${publicacion.descripcion}</textarea>
                </div>
                <div class="form-group mb-2">
                    <label>Precio</label>
                    <input type="text" id="swal-precio" class="form-control" value="${publicacion.precio}" />
                </div>
                <div class="form-group mb-2">
                    <label>Ubicación</label>
                    <input type="text" id="swal-ubicacion" class="form-control" value="${publicacion.ubicacion}" />
                </div>
                <div class="form-group mb-2">
                    <label>Imagen (subir nueva para reemplazar)</label>
                    <input type="file" id="swal-imagen" class="form-control" />
                    <small class="text-muted">Actual: ${publicacion.imagen}</small>
                </div>
                <div class="form-group mb-2">
                    <label>Estado</label>
                    <select id="swal-estado" class="form-control">
                        <option value="Activo" ${publicacion.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                        <option value="Inactivo" ${publicacion.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                    </select>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'border border-success shadow-lg'
            },
            preConfirm: () => {
                const titulo = document.getElementById('swal-titulo').value.trim();
                const descripcion = document.getElementById('swal-descripcion').value.trim();
                const precio = document.getElementById('swal-precio').value.trim();
                const ubicacion = document.getElementById('swal-ubicacion').value.trim();
                const estado = document.getElementById('swal-estado').value;
                const imagenInput = document.getElementById('swal-imagen');

                if (!titulo || !descripcion || !precio || !ubicacion) {
                    AlertController.showError("Todos los campos marcados son obligatorios (Título, Descripción, Precio, Ubicación).");
                    return false;
                }

                let nuevoNombreArchivo = publicacion.imagen;
                if (imagenInput.files && imagenInput.files.length > 0) {
                    nuevoNombreArchivo = imagenInput.files[0].name;
                }

                return { titulo, descripcion, precio, ubicacion, estado, nuevoNombreArchivo };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const { titulo, descripcion, precio, ubicacion, estado, nuevoNombreArchivo } = result.value;
                
                // Actualizar la publicación
                publicacion.titulo = titulo;
                publicacion.descripcion = descripcion;
                publicacion.precio = precio;
                publicacion.ubicacion = ubicacion;
                publicacion.estado = estado;
                publicacion.imagen = nuevoNombreArchivo;

                cargarPublicaciones();
                AlertController.showSuccess("Publicación actualizada correctamente.", "Actualizada");
            }
        });
    }

    // Eliminar publicación con confirmación
    function eliminarPublicacion(id) {
        AlertController.showConfirmation(
            "Esta acción no se puede deshacer.",
            "¿Eliminar publicación?",
            () => {
                datosNegocio.publicaciones = datosNegocio.publicaciones.filter(pub => pub.id !== id);
                cargarPublicaciones();
                AlertController.showSuccess("La publicación ha sido eliminada.", "Eliminada");
            }
        );
    }

    // Búsqueda simulada
    function buscarNegocio(termino) {
        if (!termino.trim()) return;
        AlertController.showInfo(
            `Has buscado: "${termino}". Esta funcionalidad estará disponible próximamente.`,
            "Búsqueda en desarrollo"
        );
        inputBuscar.value = '';
    }
});
