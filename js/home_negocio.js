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
                reaccion: 15,
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
                reaccion: 8,
                compartidos: 1
            }
        ]
    };

    // Elementos del DOM
    const nombreNegocioNavbar = document.getElementById('nombreNegocioNavbar'); // Nuevo elemento para el nombre
    const logoUsuario = document.getElementById('logoUsuario');
    const logoUsuarioBtn = document.getElementById('logoUsuarioBtn'); // Nuevo botón
    const logoUsuarioImagen = document.getElementById('logoUsuarioImagen'); // Nueva imagen
    const sidebarPerfil = document.getElementById('sidebarPerfil');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const btnCerrarSidebar = document.getElementById('btnCerrarSidebar');
    const btnGuardarCambios = document.getElementById('btnGuardarCambios');
    const btnEliminarCuenta = document.getElementById('btnEliminarCuenta');
    const btnCerrarSesionSidebar = document.getElementById('btnCerrarSesionSidebar');

    const btnCrearPublicacion = document.getElementById('btnCrearPublicacion');
    const inputBuscar = document.getElementById('inputBuscar');
    
    const changeProfileImageButton = document.getElementById('changeProfileImageButton');
    const profileImageInput = document.getElementById('profileImageInput');
    const profileImageDisplay = document.getElementById('profileImageDisplay');
    let nuevaFotoPerfil = null; // Variable para almacenar la nueva foto de perfil (Base64)

    //const btnBuscar = document.querySelector('.navbar .btn-dark'); // Obtener el botón de buscar
    const btnBuscar = document.getElementById('btnBuscarImagen'); // Obtener el nuevo botón
    const btnLimpiarBusqueda = document.getElementById('btnLimpiarBusqueda'); // Obtener el nuevo botón
    let todasLasPublicacionesDelNegocio = []; // Variable para almacenar todas las publicaciones del negocio


    function actualizarBotonLimpiar() {
        if (inputBuscar.value.trim() !== '') {
            btnLimpiarBusqueda.style.display = 'block';
        } else {
            btnLimpiarBusqueda.style.display = 'none';
        }
    }
    
    // Inicialización
    inicializarApp();

    function inicializarApp() {
        cargarPublicaciones(); // Cargar todas las publicaciones del negocio al inicio
        cargarDatosNegocio();
        configurarEventListeners();
        actualizarBotonLimpiar(); // Asegurar el estado inicial del botón al cargar la página

    }

    function configurarEventListeners() {
        // Mostrar/ocultar sidebar de perfil
        //logoUsuario.addEventListener('click', mostrarSidebarPerfil);
        logoUsuarioBtn.addEventListener('click', mostrarSidebarPerfil); // Evento al botón de la imagen
        btnCerrarSidebar.addEventListener('click', ocultarSidebarPerfil);
        sidebarOverlay.addEventListener('click', ocultarSidebarPerfil);
        
        // Cerrar sesión desde el sidebar
        if (btnCerrarSesionSidebar) {
            btnCerrarSesionSidebar.addEventListener('click', confirmarCerrarSesion);
        }

        // Crear nueva publicación
        btnCrearPublicacion.addEventListener('click', mostrarPopupCrearPublicacion);

        // Guardar cambios en el perfil
        btnGuardarCambios.addEventListener('click', guardarCambiosNegocio);

        // Eliminar cuenta
        btnEliminarCuenta.addEventListener('click', mostrarConfirmacionEliminarCuenta);

        // Búsqueda de publicaciones al hacer clic en el botón
        btnBuscar.addEventListener('click', realizarBusqueda);
        
        // Evento para mostrar/ocultar el botón de limpiar búsqueda
        inputBuscar.addEventListener('input', actualizarBotonLimpiar);

        // Limpiar búsqueda y recargar todas las publicaciones
        btnLimpiarBusqueda.addEventListener('click', limpiarBusqueda);

        // Búsqueda de publicaciones al presionar Enter en el input
        inputBuscar.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                realizarBusqueda();
            }
        });

        
        // Cambiar foto de perfil
    changeProfileImageButton.addEventListener('click', () => profileImageInput.click());
    profileImageInput.addEventListener('change', mostrarNuevaFotoPerfil);
    }
    
    
    
    function limpiarBusqueda() {
        inputBuscar.value = ''; // Limpiar el campo de búsqueda
        actualizarBotonLimpiar(); // Ocultar el botón de limpiar
        mostrarPublicaciones(todasLasPublicacionesDelNegocio); // Mostrar todas las publicaciones
    }

    function mostrarNuevaFotoPerfil(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profileImageDisplay.src = e.target.result;
            nuevaFotoPerfil = e.target.result; // Almacenar como Base64
        };
        reader.readAsDataURL(file);
    }
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
    
    function confirmarCerrarSesion() {
        ocultarSidebarPerfil();
        AlertController.showConfirmation(
            "¿Estás seguro de que deseas cerrar sesión?",
            "Cerrar Sesión",
            () => {
                cerrarSesion();
            }
        );
    }

    function cerrarSesion() {
        // Aquí deberías realizar las acciones necesarias para cerrar la sesión
        // como limpiar el localStorage y redirigir al usuario a la página de inicio de sesión.
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
        setTimeout(() => {
                window.location.href = '../BIZZFIZZ/index.html';
            }, 1000); // 5000 milisegundos = 5 segundos
    }

    // Cargar datos del negocio en el sidebar
    // Cargar datos del negocio en el sidebar
function cargarDatosNegocio() {
    const nombreNegocio = localStorage.getItem('userName');
    if (!nombreNegocio) {
        AlertController.showError("No se encontró el nombre del negocio en el almacenamiento local.");
        return;
    }
        document.getElementById('nombreNegocioNavbar').textContent = nombreNegocio; // <---- AGREGAR ESTA LÍNEA

    

    // Obtener la categoría actual del negocio
    fetch(`/BIZZFIZZ/api/negocio/getByUserName/${nombreNegocio}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del negocio');
            }
            return response.json();
        })
        .then(negocio => {
            document.getElementById('pais').value = negocio.pais || '';
            document.getElementById('estado').value = negocio.estado || '';
            document.getElementById('ciudad').value = negocio.ciudad || '';
            document.getElementById('codigoPostal').value = negocio.codigo_postal || '';
            document.getElementById('calle').value = negocio.calle || '';
            document.getElementById('colonia').value = negocio.colonia || '';
            document.getElementById('numeroContacto').value = negocio.telefono_contacto || '';
            document.getElementById('numeroWhatsApp').value = negocio.whatsapp || '';
            
            profileImageDisplay.src = negocio.foto_perfil || 'imagenes/subir_perfil.png';
            logoUsuarioImagen.src = negocio.foto_perfil || 'imagenes/icono_perfil.png'; // Cargar la imagen en el botón del menú

            // Obtener la lista de categorías y llenar el select
            fetch('/BIZZFIZZ/api/categoria/getAllCategoria')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al obtener las categorías');
                    }
                    return response.json();
                })
                .then(categorias => {
                    const selectCategoria = document.getElementById('business-category');
                    selectCategoria.innerHTML = ''; // Limpiar el select

                    // Si el negocio tiene una categoría, añadirla primero y seleccionarla
                    if (negocio.categoria && negocio.categoria.nombre_categoria) {
                        const optionCategoriaActual = document.createElement('option');
                        optionCategoriaActual.value = negocio.categoria.nombre_categoria;
                        optionCategoriaActual.textContent = negocio.categoria.nombre_categoria;
                        optionCategoriaActual.selected = true; // Seleccionar esta opción
                        selectCategoria.appendChild(optionCategoriaActual);
                    }

                    // Añadir el resto de categorías, evitando duplicados
                    categorias.forEach(categoria => {
                        if (!negocio.categoria || categoria.nombre_categoria !== negocio.categoria.nombre_categoria) {
                            const option = document.createElement('option');
                            option.value = categoria.nombre_categoria;
                            option.textContent = categoria.nombre_categoria;
                            selectCategoria.appendChild(option);
                        }
                    });

                    // Si la categoría del negocio no estaba en la lista, seleccionarla
                    if (negocio.categoria && negocio.categoria.nombre_categoria) {
                        selectCategoria.value = negocio.categoria.nombre_categoria;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    AlertController.showError("Error al cargar las categorías.");
                });
        })
        .catch(error => {
            console.error('Error:', error);
            AlertController.showError("Error al cargar los datos del negocio.");
        });
}
    
    // Mostrar las publicaciones en el contenedor
    function mostrarPublicaciones(publicaciones) {
        const contenedorPublicaciones = document.getElementById('contenedorPublicaciones');
        contenedorPublicaciones.innerHTML = '';
        if (publicaciones.length > 0) {
            publicaciones.forEach(pub => {
                const publicacionHTML = crearElementoPublicacion(pub);
                contenedorPublicaciones.appendChild(publicacionHTML);
            });
        } else {
            contenedorPublicaciones.innerHTML = '<p>No se encontraron publicaciones.</p>';
        }
    }
    
    function realizarBusqueda() {
        const terminoBusqueda = inputBuscar.value.trim().toLowerCase();
        if (terminoBusqueda) {
            const publicacionesFiltradas = todasLasPublicacionesDelNegocio.filter(pub =>
                pub.titulo.toLowerCase().includes(terminoBusqueda)
            );
            mostrarPublicaciones(publicacionesFiltradas);
        } else {
            // Si el campo de búsqueda está vacío, mostrar todas las publicaciones del negocio
            mostrarPublicaciones(todasLasPublicacionesDelNegocio);
        }
    }

    // Cargar y mostrar publicaciones en el panel
    function cargarPublicaciones() {
    const contenedorPublicaciones = document.getElementById('contenedorPublicaciones');
    contenedorPublicaciones.innerHTML = ''; // Limpiar el contenedor antes de cargar nuevas publicaciones

    // Obtener el nombre del negocio del localStorage
    const nombreNegocio = localStorage.getItem('userName');

    if (!nombreNegocio) {
        AlertController.showError("No se encontró el nombre del negocio en el almacenamiento local.");
        return;
    }

    fetch('/BIZZFIZZ/api/publicacion/getAllPublicacion')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las publicaciones');
            }
            return response.json();
        })
        .then(publicaciones => {
            if (publicaciones && publicaciones.length > 0) {
                // Filtrar las publicaciones por el nombre del negocio
                const publicacionesFiltradas = publicaciones.filter(pub => pub.negocio.nombre_negocio === nombreNegocio);

                if (publicacionesFiltradas.length > 0) {
                    mostrarPublicaciones(publicacionesFiltradas);
                    // ACTUALIZACIÓN IMPORTANTE: Actualizar la variable global
                    todasLasPublicacionesDelNegocio = [...publicacionesFiltradas];
                } else {
                    contenedorPublicaciones.innerHTML = '<p>No hay publicaciones disponibles para este negocio.</p>';
                    todasLasPublicacionesDelNegocio = []; // Asegurar que la variable también se vacíe si no hay publicaciones
                }
            } else {
                contenedorPublicaciones.innerHTML = '<p>No hay publicaciones disponibles.</p>';
                todasLasPublicacionesDelNegocio = []; // Asegurar que la variable también se vacíe si no hay publicaciones
            }
        })
        .catch(error => {
            console.error('Error:', error);
            contenedorPublicaciones.innerHTML = '<p>Error al cargar las publicaciones.</p>';
            todasLasPublicacionesDelNegocio = []; // Asegurar que la variable también se vacíe en caso de error
        });
}

    function crearElementoPublicacion(publicacion) {
    const divPublicacion = document.createElement('div');
    divPublicacion.className = 'col-12 tarjeta-publicacion';

    let carouselHTML = '';
    if (publicacion.imagen_publicacion && publicacion.imagen_publicacion.length > 0) {
        carouselHTML = `
            <div id="carousel-${publicacion.id}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    ${publicacion.imagen_publicacion.map((img, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="${img}" class="d-block w-100" alt="${publicacion.titulo}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        carouselHTML = '<div class="placeholder-imagen">Sin imagen</div>';
    }

    let ubicacionHTML = '';
    if (publicacion.ubicacion && publicacion.ubicacion.trim() !== '' && publicacion.ubicacion !== 'Ubicación no disponible') {
        ubicacionHTML = `<div class="ubicacion-publicacion"><i class="fa fa-map-marker-alt"></i> ${publicacion.ubicacion}</div>`;
    }

    divPublicacion.innerHTML = `
        <div class="encabezado-publicacion">
            <h3 class="titulo-publicacion">${publicacion.titulo}</h3>
        </div>
        <div class="cuerpo-publicacion">
            <div class="contenedor-imagen">
                ${carouselHTML}
            </div>
            <div class="contenedor-detalles">
                <div class="descripcion-publicacion">${publicacion.descripcion}</div>
                <div class="footer-publicacion">
                    ${ubicacionHTML}
                    ${publicacion.precio ? `<div class="precio-publicacion">${publicacion.precio}</div>` : ''}
                </div>
                <div class="mt-2">
                    <span class="badge bg-${publicacion.activo ? 'success' : 'secondary'}">${publicacion.activo ? 'Activo' : 'Inactivo'}</span>
                    <span class="ms-3"><i class="fa fa-heart"></i> ${publicacion.reaccion || 0} reacciones</span>
                    <span class="ms-3"><i class="fa fa-share"></i> ${publicacion.compartidos || 0} compartidos</span>
                </div>
            </div>
        </div>
        <div class="acciones-publicacion">
            <button class="btn-editar" data-id="${publicacion.id_publicacion}" title="Editar"><i class="fas fa-edit"></i></button>
            <button class="btn-eliminar" data-id="${publicacion.id_publicacion}" title="Eliminar"><i ></i></button>
        </div>
    `;

    const btnEditar = divPublicacion.querySelector('.btn-editar');
    const btnEliminar = divPublicacion.querySelector('.btn-eliminar');

    btnEditar.addEventListener('click', () => editarPublicacion(publicacion.id_publicacion));
    btnEliminar.addEventListener('click', () => eliminarPublicacion(publicacion.id_publicacion));

    const carousel = divPublicacion.querySelector(`#carousel-${publicacion.id}`);
    if (carousel) {
        new bootstrap.Carousel(carousel, {
            interval: 2000,
            wrap: true,
            keyboard: false,
            pause: 'hover'
        });
    }

    return divPublicacion;
}

    // Guardar cambios del perfil
    function guardarCambiosNegocio() {
    const nombreNegocio = localStorage.getItem('userName');
    if (!nombreNegocio) {
        AlertController.showError("No se encontró el nombre del negocio en el almacenamiento local.");
        return;
    }

    const categoriaNombre = document.getElementById('business-category').value;
    // Buscar el ID de la categoría basado en el nombre
    fetch('/BIZZFIZZ/api/categoria/getAllCategoria')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las categorías');
            }
            return response.json();
        })
        .then(categorias => {
            const categoriaSeleccionada = categorias.find(cat => cat.nombre_categoria === categoriaNombre);
            const categoriaId = categoriaSeleccionada ? categoriaSeleccionada.id_categoria : null;

            if (!categoriaId && categoriaNombre) {
                AlertController.showError("La categoría seleccionada no es válida.");
                return;
            }

            const datosActualizados = {
                nombre_negocio: nombreNegocio, // Necesario para identificar el negocio a actualizar
                categoria: {
                    id_categoria: categoriaId,
                    nombre_categoria: categoriaNombre
                },
                pais: document.getElementById('pais').value,
                estado: document.getElementById('estado').value,
                ciudad: document.getElementById('ciudad').value,
                codigo_postal: document.getElementById('codigoPostal').value,
                calle: document.getElementById('calle').value,
                colonia: document.getElementById('colonia').value,
                telefono_contacto: document.getElementById('numeroContacto').value,
                whatsapp: document.getElementById('numeroWhatsApp').value,
            };

            // Solo añadir la foto de perfil si se ha seleccionado una nueva
            if (nuevaFotoPerfil) {
                datosActualizados.foto_perfil = nuevaFotoPerfil;
            }

            fetch('/BIZZFIZZ/api/negocio/actualizarNegocioPorNombre', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosActualizados)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.mensaje || 'Error al actualizar el negocio'); });
                }
                return response.json();
            })
            .then(data => {
                AlertController.showSuccess('Los datos de tu negocio han sido actualizados correctamente.', 'Cambios guardados');
                cargarDatosNegocio(); // Recargar los datos para mostrar la nueva foto (si se actualizó)
                ocultarSidebarPerfil();
            })
            .catch(error => {
                console.error('Error:', error);
                AlertController.showError("Error al actualizar los datos del negocio: " + error.message);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            AlertController.showError("Error al obtener las categorías para guardar.");
        });
}

    
    // Confirmación y eliminación de cuenta (MODIFICADO)
    function mostrarConfirmacionEliminarCuenta() {
        ocultarSidebarPerfil();
        AlertController.showConfirmation(
            "Esta acción no se puede deshacer. Tu cuenta y toda la información asociada serán desactivadas.",
            "¿Estás seguro?",
            () => {
                eliminarCuentaNegocio(); // Llamar a la nueva función para desactivar la cuenta
            }
        );
    }

    function eliminarCuentaNegocio() {
        const nombreNegocio = localStorage.getItem('userName');
        if (!nombreNegocio) {
            AlertController.showError("No se encontró el nombre del negocio en el almacenamiento local.");
            return;
        }

        fetch(`/BIZZFIZZ/api/negocio/eliminarNegocio/${nombreNegocio}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.mensaje || 'Error al desactivar la cuenta.');
                });
            }
            return response.json();
        })
        .then(data => {
            AlertController.showSuccess('Tu cuenta ha sido desactivada correctamente.', 'Cuenta desactivada');
            // Limpiar el localStorage (opcional, dependiendo de tu flujo)
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userType');
            // Redirigir a la página de inicio después de 5 segundos
            setTimeout(() => {
                window.location.href = '../BIZZFIZZ/index.html';
            }, 2000); // 5000 milisegundos = 5 segundos
        })
        .catch(error => {
            console.error('Error:', error);
            AlertController.showError("Error al desactivar la cuenta: " + error.message);
        });
    }



    function mostrarPopupCrearPublicacion() {
    let imagenesNuevas = []; // Array para almacenar las nuevas imágenes añadidas

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
                <label>Precio (opcional)</label>
                <input type="text" id="swal-precio" class="form-control" placeholder="Precio" />
            </div>
            <div class="form-group mb-2">
                <label>Imágenes</label>
                <input type="file" id="swal-imagenes" class="form-control" multiple accept="image/*" />
                <div id="swal-imagenes-preview" class="mt-2"></div>
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

            if (!titulo || !descripcion) {
                AlertController.showError("Todos los campos marcados son obligatorios (Título, Descripción).");
                return false;
            }

            return { titulo, descripcion, precio, imagenesNuevas };
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            const { titulo, descripcion, precio, imagenesNuevas } = result.value;

            // Obtener el nombre del negocio del localStorage
            const nombreNegocio = localStorage.getItem('userName');

            if (!nombreNegocio) {
                AlertController.showError("No se encontró el nombre del negocio en el almacenamiento local.");
                return;
            }

            // Crear el objeto de publicación para enviar al backend
            const nuevaPublicacion = {
                negocio: {
                    nombre_negocio: nombreNegocio
                },
                titulo: titulo,
                descripcion: descripcion,
                precio: precio || null,
                imagen_publicacion: imagenesNuevas,
                reaccion: 0
            };

            // Enviar la publicación al backend (tu lógica de envío aquí)
            fetch('/BIZZFIZZ/api/publicacion/agregarPublicacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaPublicacion)
            })
            .then(response => response.json())
            .then(data => {
                if (data.mensaje === "Publicacion registrada correctamente") {
                    AlertController.showSuccess("Publicación creada exitosamente.", "Creada");
                    cargarPublicaciones(); // Recargar las publicaciones después de crear una nueva
                } else {
                    AlertController.showError("Error al crear la publicación.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                AlertController.showError("Error al crear la publicación.");
            });
        }
    });

    // Agregar evento para previsualizar las imágenes seleccionadas
    const imagenesInput = document.getElementById('swal-imagenes');
    const imagenesPreview = document.getElementById('swal-imagenes-preview');

    imagenesInput.addEventListener('change', (event) => {
        const files = event.target.files;
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100px';
                img.style.marginRight = '5px';
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('imagen-existente');
                imgContainer.style.position = 'relative';
                imgContainer.style.display = 'inline-block';
                imgContainer.appendChild(img);
                const btnEliminar = document.createElement('button');
                btnEliminar.type = 'button';
                btnEliminar.classList.add('btn', 'btn-danger', 'btn-sm', 'btn-eliminar-imagen');
                btnEliminar.textContent = '×';
                btnEliminar.style.position = 'absolute';
                btnEliminar.style.top = '0';
                btnEliminar.style.right = '0';
                imgContainer.appendChild(btnEliminar);
                imagenesPreview.appendChild(imgContainer);

                // Agregar la imagen al array de imágenes nuevas
                imagenesNuevas.push(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Agregar evento para eliminar imágenes nuevas
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-eliminar-imagen')) {
            event.target.parentElement.style.display = 'none';
            // Eliminar la imagen del array imagenesNuevas
            const index = imagenesNuevas.findIndex(img => img === event.target.parentElement.querySelector('img').src);
            if (index > -1) {
                imagenesNuevas.splice(index, 1);
            }
        }
    });
}

    // Pop up para editar publicación (Editar)
    function editarPublicacion(id) {
    fetch(`/BIZZFIZZ/api/publicacion/getAllPublicacion`)
        .then(response => response.json())
        .then(publicaciones => {
            const publicacion = publicaciones.find(pub => pub.id_publicacion === id);
            if (!publicacion) return;

            // Almacenar las imágenes existentes
            let imagenesExistentes = [...publicacion.imagen_publicacion];
            let imagenesNuevas = []; // Array para almacenar las nuevas imágenes añadidas

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
                        <input type="text" id="swal-precio" class="form-control" value="${publicacion.precio || ''}" />
                    </div>
                    <div class="form-group mb-2">
                        <label>Estado</label>
                        <select id="swal-estado" class="form-control">
                            <option value="true" ${publicacion.activo ? 'selected' : ''}>Activo</option>
                            <option value="false" ${!publicacion.activo ? 'selected' : ''}>Inactivo</option>
                        </select>
                    </div>
                    <div class="form-group mb-2">
                        <label>Imágenes</label>
                        <input type="file" id="swal-imagenes" class="form-control" multiple accept="image/*" />
                        <div id="swal-imagenes-preview" class="mt-2">
                            ${imagenesExistentes.map((img, index) => `
                                <div class="imagen-existente" data-index="${index}" style="position: relative; display: inline-block;">
                                    <img src="${img}" style="max-width: 100px; margin-right: 5px;" />
                                    <button type="button" class="btn btn-danger btn-sm btn-eliminar-imagen" style="position: absolute; top: 0; right: 0;">&times;</button>
                                </div>
                            `).join('')}
                        </div>
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
                    const activo = document.getElementById('swal-estado').value === 'true';

                    return { titulo, descripcion, precio, activo, imagenesNuevas, imagenesExistentes };
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const { titulo, descripcion, precio, activo, imagenesNuevas, imagenesExistentes } = result.value;

                    // Obtener las imágenes restantes después de eliminar
                    const imagenesFinales = imagenesExistentes.filter((_, index) => {
                        return !document.querySelector(`.imagen-existente[data-index="${index}"] .btn-eliminar-imagen.eliminado`);
                    }).concat(imagenesNuevas);

                    const publicacionActualizada = {
                        id_publicacion: publicacion.id_publicacion,
                        titulo: titulo,
                        descripcion: descripcion,
                        precio: precio || null,
                        imagen_publicacion: imagenesFinales,
                        activo: activo
                    };

                    fetch('/BIZZFIZZ/api/publicacion/actualizarPublicacion', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(publicacionActualizada)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.mensaje === "Publicación actualizada correctamente") {
                            AlertController.showSuccess("Publicación actualizada correctamente.", "Actualizada");
                            cargarPublicaciones();
                        } else {
                            AlertController.showError("Error al actualizar la publicación.");
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        AlertController.showError("Error al actualizar la publicación.");
                    });
                }
            });

            // Agregar evento para eliminar imágenes existentes y nuevas
            document.addEventListener('click', function(event) {
                if (event.target.classList.contains('btn-eliminar-imagen')) {
                    event.target.classList.add('eliminado');
                    event.target.parentElement.style.display = 'none';
                }
            });

            // Agregar evento para previsualizar las imágenes seleccionadas
            const imagenesInput = document.getElementById('swal-imagenes');
            const imagenesPreview = document.getElementById('swal-imagenes-preview');

            imagenesInput.addEventListener('change', (event) => {
                const files = event.target.files;
                for (const file of files) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.maxWidth = '100px';
                        img.style.marginRight = '5px';
                        const imgContainer = document.createElement('div');
                        imgContainer.classList.add('imagen-existente');
                        imgContainer.style.position = 'relative'; // Añadir posición relativa al contenedor
                        imgContainer.style.display = 'inline-block'; // Mostrar en línea
                        imgContainer.appendChild(img);
                        const btnEliminar = document.createElement('button');
                        btnEliminar.type = 'button';
                        btnEliminar.classList.add('btn', 'btn-danger', 'btn-sm', 'btn-eliminar-imagen');
                        btnEliminar.textContent = '×';
                        btnEliminar.style.position = 'absolute';
                        btnEliminar.style.top = '0';
                        btnEliminar.style.right = '0';
                        imgContainer.appendChild(btnEliminar);
                        imagenesPreview.appendChild(imgContainer);

                        // Agregar la imagen al array de imágenes nuevas
                        imagenesNuevas.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });
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
    
    
    
    // Cargar todas las publicaciones del negocio al inicio
    /*function cargarPublicacionesIniciales() {
        const contenedorPublicaciones = document.getElementById('contenedorPublicaciones');
        contenedorPublicaciones.innerHTML = '';

        const nombreNegocio = localStorage.getItem('userName');
        if (!nombreNegocio) {
            AlertController.showError("No se encontró el nombre del negocio en el almacenamiento local.");
            return;
        }

        fetch('/BIZZFIZZ/api/publicacion/getAllPublicacion')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las publicaciones');
                }
                return response.json();
            })
            .then(publicaciones => {
                if (publicaciones && publicaciones.length > 0) {
                    todasLasPublicacionesDelNegocio = publicaciones.filter(pub => pub.negocio.nombre_negocio === nombreNegocio);
                    mostrarPublicaciones(todasLasPublicacionesDelNegocio);
                } else {
                    contenedorPublicaciones.innerHTML = '<p>No hay publicaciones disponibles para este negocio.</p>';
                    todasLasPublicacionesDelNegocio = [];
                }
            })
            .catch(error => {
                console.error('Error:', error);
                contenedorPublicaciones.innerHTML = '<p>Error al cargar las publicaciones.</p>';
                todasLasPublicacionesDelNegocio = [];
            });
    }*/
});
