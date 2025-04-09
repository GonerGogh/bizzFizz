 document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const profileTrigger = document.getElementById('profile-trigger');
    const profileDropdown = document.getElementById('profile-dropdown');
    const publicationsGrid = document.getElementById('publications-grid');
    const profileImageDropdown = document.getElementById('profile-image-dropdown');
    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    
    const profileImageUpload = document.getElementById('profileImageUpload'); // Declaración de la variable
    const inputBuscar = document.getElementById('buscar');
    const btnBuscar = document.getElementById('BotonBuscar');
    
    const likedPublications = JSON.parse(localStorage.getItem('likedPublications')) || [];

    function isPublicationLiked(publicationId) {
        return likedPublications.includes(publicationId.toString());
    }

    function updateLikedPublicationsStorage() {
        localStorage.setItem('likedPublications', JSON.stringify(likedPublications));
    }
    
    
    // **Validador de sesión de cliente**
    function verificarSesionCliente() {
        const userName = localStorage.getItem('userName');
        const userType = localStorage.getItem('userType');

        if (!userName || userType !== 'cliente') {
            // Si no hay userName o el userType no es "cliente",
            // redirigir al usuario a la página de inicio de sesión (o a donde sea apropiado)
            console.warn('Sesión no válida para cliente. Redirigiendo...');
            window.location.href = 'index.html'; // Reemplaza 'index.html' con tu página de inicio de sesión
            return false; // Indica que la sesión no es válida
        }
        return true; // Indica que la sesión es válida para un cliente
    }
    
    
    /* Filtrado de publicaciones */
    function filtrarPublicaciones(textoBusqueda) {
        // Si el texto de búsqueda está vacío, mostrar todas las publicaciones
        if (!textoBusqueda.trim()) {
            loadPublications();
            return;
        }

        // Mostrar indicador de carga
        publicationsGrid.innerHTML = '<div class="loading">Buscando publicaciones...</div>';

        fetch('/BIZZFIZZ/api/publicacion/getAllPublicacionActiva')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    // Filtrar publicaciones que contengan el texto de búsqueda en título o descripción
                    const textoLowerCase = textoBusqueda.toLowerCase();
                    const publicacionesFiltradas = data.filter(publicacion => 
                        publicacion.titulo.toLowerCase().includes(textoLowerCase) || 
                        publicacion.descripcion.toLowerCase().includes(textoLowerCase)
                    );

                    // Limpiar el grid y mostrar resultados
                    publicationsGrid.innerHTML = '';

                    if (publicacionesFiltradas.length > 0) {
                        // Mostrar publicaciones filtradas
                        publicacionesFiltradas.forEach(publication => {
                            const card = createPublicationCard(publication);
                            publicationsGrid.appendChild(card);
                        });

                        // Mostrar información sobre la búsqueda
                        const infoElement = document.createElement('div');
                        infoElement.className = 'filter-info';
                        infoElement.innerHTML = `<p>Mostrando ${publicacionesFiltradas.length} resultados para "${textoBusqueda}" <a href="#" id="clear-filter">Mostrar todas</a></p>`;
                        publicationsGrid.insertAdjacentElement('beforebegin', infoElement);

                        // Evento para quitar el filtro
                        document.getElementById('clear-filter').addEventListener('click', function(e) {
                            e.preventDefault();
                            document.querySelector('.filter-info')?.remove();
                            inputBuscar.value = ''; // Limpiar el campo de búsqueda
                            loadPublications(); // Cargar todas las publicaciones
                        });
                    } else {
                        // Si no hay resultados
                        publicationsGrid.innerHTML = 
                            `<div class="no-results">No se encontraron publicaciones que contengan "${textoBusqueda}". <a href="#" id="clear-filter">Mostrar todas</a></div>`;

                        // Evento para quitar el filtro
                        document.getElementById('clear-filter').addEventListener('click', function(e) {
                            e.preventDefault();
                            inputBuscar.value = ''; // Limpiar el campo de búsqueda
                            loadPublications(); // Cargar todas las publicaciones
                        });
                    }
                } else {
                    publicationsGrid.innerHTML = '<p>No se encontraron publicaciones.</p>';
                }
            })
            .catch(error => {
                console.error('Error al filtrar publicaciones:', error);
                publicationsGrid.innerHTML = '<p>Error al buscar publicaciones.</p>';
            });
    }

    // Filtrado en tiempo real mientras el usuario escribe
    let timeoutId;   
    
    inputBuscar.addEventListener('input', function() {
        // Cancelar cualquier búsqueda pendiente
        clearTimeout(timeoutId);
        
        // Esperar 300ms después de que el usuario deje de escribir para realizar la búsqueda
        timeoutId = setTimeout(() => {
            // Eliminar cualquier mensaje de filtro anterior
            document.querySelector('.filter-info')?.remove();
            
            // Filtrar publicaciones con el texto actual
            filtrarPublicaciones(inputBuscar.value);
        }, 300);
    });
    
    
    // Configurar evento para la tecla Enter en el campo de búsqueda
    inputBuscar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            // Prevenir el comportamiento por defecto del formulario
            e.preventDefault();
            
            // Eliminar cualquier mensaje de filtro anterior
            document.querySelector('.filter-info')?.remove();
            
            // Filtrar publicaciones con el texto actual
            filtrarPublicaciones(inputBuscar.value);
        }
    });
    
    
    // Configurar evento para el botón de búsqueda
    btnBuscar.addEventListener('click', function() {
        // Eliminar cualquier mensaje de filtro anterior
        document.querySelector('.filter-info')?.remove();
        
        // Filtrar publicaciones con el texto actual
        filtrarPublicaciones(inputBuscar.value);
    });

    /*prueba del filtro por categoria*/
    function cargarPublicacionesPorCategoria(nombreCategoria) {
        // Mostrar indicador de carga
        publicationsGrid.innerHTML = '<div class="loading">Cargando publicaciones...</div>';

        // Realizar petición al nuevo endpoint
        fetch(`/BIZZFIZZ/api/publicacion/getByCategoria/${nombreCategoria}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                publicationsGrid.innerHTML = ''; // Limpiar el grid

                if (Array.isArray(data) && data.length > 0) {
                    // Si hay publicaciones, crear las tarjetas
                    data.forEach(publication => {
                        const card = createPublicationCard(publication);
                        publicationsGrid.appendChild(card);
                    });

                    // Mostrar cuántas publicaciones se encontraron
                    const infoElement = document.createElement('div');
                    infoElement.className = 'filter-info';
                    infoElement.innerHTML = `<p>Mostrando ${data.length} publicaciones de la categoría "${nombreCategoria}" <a href="#" id="clear-filter">Mostrar todas</a></p>`;
                    publicationsGrid.insertAdjacentElement('beforebegin', infoElement);

                    // Evento para quitar el filtro
                    document.getElementById('clear-filter').addEventListener('click', function(e) {
                        e.preventDefault();
                        document.querySelector('.filter-info')?.remove();
                        loadPublications(); // Cargar todas las publicaciones
                    });
                } else {
                    // Si no hay publicaciones en esta categoría
                    publicationsGrid.innerHTML = 
                        `<div class="no-results">No se encontraron publicaciones en la categoría "${nombreCategoria}". <a href="#" id="clear-filter">Mostrar todas</a></div>`;

                    // Evento para quitar el filtro
                    document.getElementById('clear-filter').addEventListener('click', function(e) {
                        e.preventDefault();
                        loadPublications(); // Cargar todas las publicaciones
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar publicaciones por categoría:', error);
                publicationsGrid.innerHTML = 
                    `<div class="error">Error al cargar las publicaciones para la categoría "${nombreCategoria}". <a href="#" id="clear-filter">Mostrar todas</a></div>`;

                // Evento para quitar el filtro
                document.getElementById('clear-filter').addEventListener('click', function(e) {
                    e.preventDefault();
                    loadPublications(); // Cargar todas las publicaciones
                });
            });
        }
    
    /*función del filtro*/
    document.getElementById("filtro").addEventListener("click", () => {
        const menuItems = document.getElementById("menu-items");

        if (menuItems.style.display === "none" || menuItems.style.display === "") {
            menuItems.style.display = "block";
            menuItems.innerHTML = "";
            fetch("http://localhost:8080/BIZZFIZZ/api/categoria/getAllCategoria")
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error en la respuesta del servidor");
                    }
                    return response.json();
                })
                .then(data => {
                    data.forEach(categoria => {
                        const li = document.createElement("li");
                        li.textContent = categoria.nombre_categoria; // Mostrar el nombre
                        li.classList.add("categoria-item");

                        li.addEventListener("click", () => {
                            console.log(`Filtrando publicaciones por categoría: ${categoria.nombre_categoria}`);
                            document.querySelector('.filter-info')?.remove();
                            cargarPublicacionesPorCategoria(categoria.nombre_categoria);
                            menuItems.style.display = "none";
                        });

                        menuItems.appendChild(li);
                    });
                })
                .catch(error => {
                    console.error("Error al cargar las categorías:", error);
                    const li = document.createElement("li");
                    li.textContent = "Error al cargar las categorías";
                    menuItems.appendChild(li);
                });
        }
        else {
        // Si ya está visible, lo ocultamos
        menuItems.style.display = "none";
    }
    });
    
    
    // Función para actualizar las imágenes de perfil y la información
    function updateProfileInfo(userData) {
        const profilePics = document.querySelectorAll('.profile-pic');
        profilePics.forEach(img => {
            if (userData && userData.foto_perfil) {
                img.src = userData.foto_perfil;
            } else {
                img.src = 'imagenes/icono_perfil.png'; // Imagen por defecto si no hay foto
            }
        });

        if (userData && userData.foto_perfil) {
            profileImageDropdown.src = userData.foto_perfil;
        } else {
            profileImageDropdown.src = 'imagenes/icono_perfil.png';
        }

        if (userData && userData.usuario && userData.usuario.nombre_usuario) {
            profileUsername.textContent = userData.usuario.nombre_usuario;
        }

        if (userData && userData.usuario && userData.usuario.correo_electronico) {
            profileEmail.textContent = userData.usuario.correo_electronico;
        }
    }

    // **Función para obtener los datos del cliente desde la API**
// **Función para obtener los datos del cliente desde la API**
    function fetchUserData() {
        const userName = localStorage.getItem('userName');

        if (userName) {
            fetch(`/BIZZFIZZ/api/cliente/getByUserName/${userName}`)
                .then(response => {
                    if (!response.ok) {
                        console.warn('Error al obtener los datos del cliente:', response.status);
                        return null;
                    }
                    return response.json();
                })
                .then(clienteData => {
                    console.log("Datos del cliente recibidos:", clienteData); // <---- AGREGAMOS ESTE LOG
                    if (clienteData) {
                        updateProfileInfo(clienteData);
                    }
                })
                .catch(error => {
                    console.error('Error en la llamada a la API:', error);
                });
        } else {
            console.warn('No se encontró el userName en localStorage.');
        }
    }

    // **Función para manejar la selección de la nueva imagen**
    profileImageDropdown.addEventListener('click', () => {
        profileImageUpload.click(); // Simula el clic en el input file oculto
    });

    profileImageUpload.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newImageUrl = e.target.result;
            // Actualizar inmediatamente la vista previa
            const profilePics = document.querySelectorAll('.profile-pic');
            profilePics.forEach(img => img.src = newImageUrl);
            profileImageDropdown.src = newImageUrl;

            const userName = localStorage.getItem('userName');

            if (userName) {
                fetch(`/BIZZFIZZ/api/cliente/updateProfileImage/${userName}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json' // Asegúrate de enviar como JSON
                    },
                    body: JSON.stringify({ fotoPerfilBase64: newImageUrl }), // <---- Envía la Base64 dentro de un objeto
                })
                .then(response => {
                    if (!response.ok) {
                        console.error('Error al guardar la imagen:', response.status);
                        // Manejar el error
                    } else {
                        fetchUserData();
                        console.log('Imagen de perfil guardada exitosamente.');
                        // Opcional: Mostrar mensaje de éxito
                    }
                })
                .catch(error => {
                    console.error('Error al enviar la imagen:', error);
                    // Manejar el error
                });
            } else {
                console.warn('No se encontró el userName para guardar la imagen.');
            }
        }
        reader.readAsDataURL(file);
    }
});

     // Llamar al validador de sesión al cargar la página
    if (verificarSesionCliente()) {
        // Si la sesión es válida para un cliente, proceder a cargar los datos
        fetchUserData();
    }

    // Llamar a la función para obtener los datos del cliente al cargar la página
    //fetchUserData();
    
    
    // **Simulación de datos del cliente logueado**
    /*const loggedInClient = {
        nombre: "Nombre del Cliente",
        email: "cliente@email.com",
        fotoPerfil: "imagenes/icono_perfil.png" // Reemplaza con la URL real de la foto
    };*/

    // **Actualizar la información del perfil en el dropdown**
    /*if (loggedInClient && loggedInClient.foto_perfil) {
        const profilePic = document.querySelector('.profile-pic');
        if (profilePic) {
            profilePic.src = loggedInClient.foto_perfil;
        }
        profileImageDropdown.src = loggedInClient.foto_perfil;
        profileUsername.textContent = loggedInClient.nombre;
        profileEmail.textContent = loggedInClient.email;
    }*/
     

    // Alternar la barra lateral
    /*menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('show');
        mainContent.classList.toggle('shifted');
    });*/

    const logoutButton = document.querySelector('.logout');
if (logoutButton) {
    logoutButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del enlace

        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas cerrar sesión?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirigir al usuario a la página de inicio de sesión
                window.location.href = 'index.html';
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userType');
                localStorage.removeItem('likedPublications');
            }
        })
    });
}

const eliminarCuentaBtn = document.getElementById('delete-account');
if (eliminarCuentaBtn) {
    eliminarCuentaBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Evitar cualquier comportamiento predeterminado del botón
        Swal.fire({
            title: '¿Estás seguro de eliminar tu cuenta?',
            text: "Esta acción es irreversible.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar mi cuenta',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarCuentaCliente();
            }
        });
    });
}

function eliminarCuentaCliente() {
        const nombreCliente = localStorage.getItem('userName');
        if (!nombreCliente) {
            AlertController.showError("No se encontró el nombre del negocio en el almacenamiento local.");
            return;
        }

        fetch(`/BIZZFIZZ/api/cliente/eliminarCliente/${nombreCliente}`, {
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

    // Cerrar la barra lateral al hacer clic fuera de ella
    document.addEventListener('click', function(event) {
        const isClickInside = sidebar.contains(event.target) || menuToggle.contains(event.target);

        if (!isClickInside && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
            mainContent.classList.remove('shifted');
        }
    });

    // Alternar el menú desplegable del perfil
    profileTrigger.addEventListener('click', function(event) {
        event.stopPropagation();
        profileDropdown.classList.toggle('show');
    });

    // Cerrar el menú desplegable del perfil al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        const isClickInsideDropdown = profileDropdown.contains(event.target) || profileTrigger.contains(event.target);

        if (!isClickInsideDropdown && profileDropdown.classList.contains('show')) {
            profileDropdown.classList.remove('show');
        }
    });
    
    
    // Función para actualizar el contador de reacciones en la UI
    function updateReactionCount(publicationId, newCount) {
        const card = document.querySelector(`.publication-card[data-id="${publicationId}"]`);
        if (card) {
            const reactionCountSpan = card.querySelector('.reaction-count');
            if (reactionCountSpan) {
                reactionCountSpan.textContent = newCount;
            }
        }
    }

    // Función para enviar la petición de reaccionar a la API
function sendReaction(publicationId, isAdding) {
    const action = isAdding ? 'agregar' : 'quitar'; // Determinar la acción
    const apiUrl = `/BIZZFIZZ/api/publicacion/reaccionar/${publicationId}/${action}`; // Modificar la URL para incluir la acción
    const method = 'PUT'; // Usamos PUT para actualizar

    fetch(apiUrl, {
        method: method,
        headers: {
            'Content-Type': 'application/json' // Aunque no enviamos body, es buena práctica
        }
    })
    .then(response => {
        if (!response.ok) {
            console.error(`Error al ${isAdding ? 'agregar' : 'quitar'} reacción a la publicación ${publicationId}:`, response.status);
            // Revertir el cambio visual si la API falla
            revertReaction(publicationId, isAdding);
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (data && data.mensaje) {
            console.log(data.mensaje);
            // La actualización del contador visual ya se hizo en el event listener
        }
    })
    .catch(error => {
        console.error(`Error al comunicarse con la API para ${isAdding ? 'agregar' : 'quitar'} reacción a la publicación ${publicationId}:`, error);
        // Revertir el cambio visual en caso de error de red
        revertReaction(publicationId, isAdding);
    });
}

// Función para revertir el cambio visual en caso de error
function revertReaction(publicationId, isAdding) {
    const card = document.querySelector(`.publication-card[data-id="${publicationId}"]`);
    if (card) {
        const favoriteIcon = card.querySelector('.action-button.favorite i');
        favoriteIcon.classList.toggle('far');
        favoriteIcon.classList.toggle('fas');
        const favoriteButton = card.querySelector('.action-button.favorite');
        favoriteButton.classList.toggle('active');
        // Opcional: Actualizar el contador visualmente de nuevo si la API falla
        const reactionCountSpan = card.querySelector('.reaction-count');
        const currentCount = parseInt(reactionCountSpan.textContent);
        updateReactionCount(publicationId, isAdding ? currentCount - 1 : currentCount + 1);
    }
}

    // Función para crear una tarjeta de publicación con estilo mejorado
function createPublicationCard(publication) {
    const card = document.createElement('div');
    card.className = 'publication-card';
    card.dataset.id = publication.id_publicacion;

    // Estilos generales para la tarjeta
    card.style.borderRadius = '12px';
    card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    card.style.overflow = 'hidden';
    card.style.transition = 'transform 0.3s, box-shadow 0.3s';
    card.style.margin = '15px 0';
    card.style.backgroundColor = '#fff';
    card.style.border = '1px solid #eaeaea';

    // Efecto hover para la tarjeta
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    });

    // ==== CABECERA CON NOMBRE DEL NEGOCIO ====
    const header = document.createElement('div');
    header.className = 'publication-header';
    header.style.backgroundColor = '#f8f9fa';
    header.style.padding = '12px 15px';
    header.style.borderBottom = '1px solid #eaeaea';

    const businessName = document.createElement('h3');
    businessName.className = 'business-name';
    businessName.textContent = publication.negocio.nombre_negocio;
    businessName.style.margin = '0';
    businessName.style.fontSize = '16px';
    businessName.style.fontWeight = '600';
    businessName.style.color = '#2c3e50';

    // Agregar un icono de verificación si el negocio está verificado
    const businessNameWrapper = document.createElement('div');
    businessNameWrapper.style.display = 'flex';
    businessNameWrapper.style.alignItems = 'center';
    businessNameWrapper.appendChild(businessName);

    // Opcional: Agregar un icono o badge si el negocio tiene verificación
    if (publication.negocio.verificado) {
        const verifiedBadge = document.createElement('span');
        verifiedBadge.innerHTML = '<i class="fas fa-check-circle"></i>';
        verifiedBadge.style.color = '#3498db';
        verifiedBadge.style.marginLeft = '5px';
        verifiedBadge.style.fontSize = '14px';
        businessNameWrapper.appendChild(verifiedBadge);
    }

    header.appendChild(businessNameWrapper);
    card.appendChild(header);

    // ==== CONTENIDO PRINCIPAL ====
    const content = document.createElement('div');
    content.className = 'publication-content';

    // ==== CARRUSEL DE IMÁGENES ====
    const imageContainer = document.createElement('div');
    imageContainer.className = 'publication-image';
    imageContainer.style.position = 'relative';
    imageContainer.style.overflow = 'hidden';
    imageContainer.style.minHeight = '220px';
    imageContainer.style.maxHeight = '300px';
    imageContainer.style.backgroundColor = '#f5f5f5';

    if (publication.imagen_publicacion && publication.imagen_publicacion.length > 0) {
        const carouselId = `carousel-client-${publication.id_publicacion || Math.random().toString(36).substring(7)}`;
        imageContainer.innerHTML = `
            <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    ${publication.imagen_publicacion.map((img, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="${img}" class="d-block w-100" alt="${publication.titulo}" style="object-fit: cover; height: 250px;">
                        </div>
                    `).join('')}
                </div>
                ${publication.imagen_publicacion.length > 1 ? `
                <div class="carousel-indicators" style="bottom: 0;">
                    ${publication.imagen_publicacion.map((_, index) => `
                        <button type="button" data-bs-target="#<span class="math-inline">\{carouselId\}" data\-bs\-slide\-to\="</span>{index}" 
                        ${index === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
                    `).join('')}
                </div>` : ''}
            </div>
        `;

        // Cargar CSS de Bootstrap si no está
        const bootstrapCSS = document.querySelector('link[href*="bootstrap"]');
        if (!bootstrapCSS) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
            document.head.appendChild(link);
        }

        // Cargar JS de Bootstrap si no está
        const bootstrapJS = document.querySelector('script[src*="bootstrap"]');
        if (!bootstrapJS) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
            document.body.appendChild(script);
        }

        // Inicializar el carrusel
        setTimeout(() => {
            const carouselElement = document.getElementById(carouselId);
            if (carouselElement) {
                new bootstrap.Carousel(carouselElement, {
                    interval: 3000,
                    ride: 'carousel',
                    touch: true,
                    keyboard: false
                });
            }
        }, 0);
    } else if (publication.imagenUrl) {
        const image = document.createElement('img');
        image.src = publication.imagenUrl;
        image.alt = publication.titulo;
        image.style.width = '100%';
        image.style.height = '250px';
        image.style.objectFit = 'cover';
        image.style.display = 'block';
        imageContainer.appendChild(image);
    } else {
        const placeholder = document.createElement('div');
        placeholder.innerHTML = '<i class="far fa-image" style="font-size: 48px;"></i><p>Sin imagen disponible</p>';
        placeholder.style.backgroundColor = '#f0f0f0';
        placeholder.style.color = '#777';
        placeholder.style.textAlign = 'center';
        placeholder.style.padding = '80px 20px';
        placeholder.style.display = 'flex';
        placeholder.style.flexDirection = 'column';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.height = '250px';
        imageContainer.appendChild(placeholder);
    }
    content.appendChild(imageContainer);

    // ==== INFORMACIÓN DE LA PUBLICACIÓN ====
    const infoContainer = document.createElement('div');
    infoContainer.className = 'publication-info';
    infoContainer.style.padding = '15px';

    // Título de la publicación
    const title = document.createElement('h2');
    title.className = 'publication-title';
    title.textContent = publication.titulo;
    title.style.margin = '0 0 10px 0';
    title.style.fontSize = '20px';
    title.style.fontWeight = '700';
    title.style.color = '#1a1a1a';
    title.style.lineHeight = '1.3';
    infoContainer.appendChild(title);

    // Descripción
    const description = document.createElement('p');
    description.className = 'publication-description';
    description.textContent = publication.descripcion;
    description.style.margin = '0 0 15px 0';
    description.style.fontSize = '14px';
    description.style.color = '#555';
    description.style.lineHeight = '1.5';

    // Limitar la descripción a 3 líneas y agregar "leer más" si es necesario
    description.style.display = '-webkit-box';
    description.style.WebkitLineClamp = '3';
    description.style.WebkitBoxOrient = 'vertical';
    description.style.overflow = 'hidden';
    description.style.textOverflow = 'ellipsis';
    infoContainer.appendChild(description);

    // Separador discreto
    const divider = document.createElement('hr');
    divider.style.margin = '15px 0';
    divider.style.border = '0';
    divider.style.borderTop = '1px solid #eee';
    infoContainer.appendChild(divider);

    // Contenedor para ubicación y precio
    const metaInfo = document.createElement('div');
    metaInfo.style.display = 'flex';
    metaInfo.style.justifyContent = 'space-between';
    metaInfo.style.fontSize = '14px';
    metaInfo.style.color = '#666';

    // Ubicación
    const location = document.createElement('div');
    location.className = 'publication-location';
    location.style.display = 'flex';
    location.style.alignItems = 'center';

    const locationIcon = document.createElement('i');
    locationIcon.className = 'fas fa-map-marker-alt';
    locationIcon.style.marginRight = '5px';
    locationIcon.style.color = '#e74c3c';

    const locationSpan = document.createElement('span');
    locationSpan.textContent = publication.ubicacion || ''; //'Ubicación no especificada'

    // Condicional para mostrar el icono de ubicación solo si hay ubicación
    if (publication.ubicacion && publication.ubicacion.trim() !== '') {
        location.appendChild(locationIcon);
    }
    location.appendChild(locationSpan);
    metaInfo.appendChild(location);

    // Precio
    const price = document.createElement('div');
    price.className = 'publication-price';
    price.style.fontWeight = '700';
    price.style.color = '#9a5184'; //#2ecc71

    const priceSpan = document.createElement('span');
    priceSpan.textContent = publication.precio ? `$${publication.precio}` : ''; //'Consultar precio'
    price.appendChild(priceSpan);
    metaInfo.appendChild(price);

    infoContainer.appendChild(metaInfo);
    content.appendChild(infoContainer);
    card.appendChild(content);

    // ==== ACCIONES (ME GUSTA Y CONTACTO) ====
    const actions = document.createElement('div');
    actions.className = 'publication-actions';
    actions.style.display = 'flex';
    actions.style.justifyContent = 'space-between';
    actions.style.padding = '12px 15px';
    actions.style.borderTop = '1px solid #eaeaea';
    actions.style.backgroundColor = '#fcfcfc';

    // Contenedor para me gusta y contador
    const likeContainer = document.createElement('div');
    likeContainer.style.display = 'flex';
    likeContainer.style.alignItems = 'center';

    // Botón de me gusta (corazón)
    const favoriteButton = document.createElement('button');
    favoriteButton.className = 'action-button favorite';
    favoriteButton.style.background = 'none';
    favoriteButton.style.border = 'none';
    favoriteButton.style.cursor = 'pointer';
    favoriteButton.style.padding = '8px';
    favoriteButton.style.display = 'flex';
    favoriteButton.style.alignItems = 'center';
    favoriteButton.style.justifyContent = 'center';
    favoriteButton.style.transition = 'transform 0.2s';

    favoriteButton.addEventListener('mousedown', () => {
        favoriteButton.style.transform = 'scale(0.9)';
    });

    favoriteButton.addEventListener('mouseup', () => {
        favoriteButton.style.transform = 'scale(1)';
    });

    const favoriteIcon = document.createElement('i');
    favoriteIcon.className = 'far fa-heart';
    favoriteIcon.style.fontSize = '18px';
    favoriteIcon.style.color = '#ff5555';
    favoriteButton.appendChild(favoriteIcon);

    // Contador de reacciones
    const reactionCount = document.createElement('span');
    reactionCount.className = 'reaction-count';
    reactionCount.textContent = publication.reaccion || 0;
    reactionCount.style.marginLeft = '5px';
    reactionCount.style.fontSize = '14px';
    reactionCount.style.fontWeight = '600';
    reactionCount.style.color = '#666';

    likeContainer.appendChild(favoriteButton);
    likeContainer.appendChild(reactionCount);
    actions.appendChild(likeContainer);

    // Botón de contacto
    const contactButton = document.createElement('a');
    contactButton.className = 'action-button contact';
    contactButton.style.display = 'flex';
    contactButton.style.alignItems = 'center';
    contactButton.style.justifyContent = 'center';
    contactButton.style.backgroundColor = '#9a5184'; //#25d366
    contactButton.style.color = 'white';
    contactButton.style.padding = '8px 16px';
    contactButton.style.borderRadius = '50px';
    contactButton.style.textDecoration = 'none';
    contactButton.style.fontWeight = '600';
    contactButton.style.fontSize = '14px';
    contactButton.style.transition = 'background-color 0.3s';

    contactButton.addEventListener('mouseenter', () => {
        contactButton.style.backgroundColor = '#128C7E';
    });

    contactButton.addEventListener('mouseleave', () => {
        contactButton.style.backgroundColor = '#25d366';
    });

    const contactIcon = document.createElement('i');
    contactIcon.className = 'fab fa-whatsapp';
    contactIcon.style.marginRight = '6px';
    contactIcon.style.fontSize = '16px';
    contactButton.appendChild(contactIcon);
    contactButton.appendChild(document.createTextNode('Contactar'));

    // Configurar enlace de WhatsApp
    if (publication.negocio && publication.negocio.whatsapp) {
        const whatsappNumber = publication.negocio.whatsapp.replace(/\D/g, '');
        const mensajePredeterminado = encodeURIComponent(`Hola, estoy interesado en "${publication.titulo}"`);
        contactButton.href = `https://wa.me/${whatsappNumber}?text=${mensajePredeterminado}`;
        contactButton.target = '_blank';
    } else {
        contactButton.style.backgroundColor = '#cccccc';
        contactButton.style.cursor = 'not-allowed';
        contactButton.title = 'WhatsApp no disponible';
        contactButton.addEventListener('mouseenter', () => {
            contactButton.style.backgroundColor = '#bbbbbb';
        });
        contactButton.addEventListener('mouseleave', () => {
            contactButton.style.backgroundColor = '#cccccc';
        });
    }

    actions.appendChild(contactButton);
    card.appendChild(actions);

    // Verificar si la publicación ya está "liked"
    const isInitiallyLiked = isPublicationLiked(publication.id_publicacion);
    if (isInitiallyLiked) {
        favoriteIcon.classList.remove('far');
        favoriteIcon.classList.add('fas');
        favoriteButton.classList.add('active');
    }

    // Funcionalidad del botón de favoritos
    favoriteButton.addEventListener('click', function() {
        const isCurrentlyLiked = favoriteIcon.classList.contains('fas');
        const publicationId = publication.id_publicacion;

        // Efecto visual al hacer clic
        favoriteButton.style.transform = 'scale(1.2)';
        setTimeout(() => {
            favoriteButton.style.transform = 'scale(1)';
        }, 200);

        // Cambiar el estado del icono
        favoriteIcon.classList.toggle('far');
        favoriteIcon.classList.toggle('fas');
        this.classList.toggle('active');

        // Actualizar el contador visual
        const currentCount = parseInt(reactionCount.textContent);
        updateReactionCount(publicationId, isCurrentlyLiked ? currentCount - 1 : currentCount + 1);

        // Enviar la petición a la API
        sendReaction(publicationId, !isCurrentlyLiked);

        // Actualizar el almacenamiento local
        if (!isCurrentlyLiked) {
            if (!likedPublications.includes(publicationId.toString())) {
                likedPublications.push(publicationId.toString());
            }
        } else {
            const index = likedPublications.indexOf(publicationId.toString());
            if (index > -1) {
                likedPublications.splice(index, 1);
            }
        }updateLikedPublicationsStorage();
    });

    return card;
}

    // Función para cargar las publicaciones desde la API
    function loadPublications() {
        fetch('/BIZZFIZZ/api/publicacion/getAllPublicacionActiva') // Ajusta la URL si es diferente
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    publicationsGrid.innerHTML = ''; // Limpiar el contenido anterior
                    data.forEach(publication => {
                        const card = createPublicationCard(publication);
                        publicationsGrid.appendChild(card);
                    });
                } else if (data && data.mensaje) {
                    publicationsGrid.innerHTML = `<p>${data.mensaje}</p>`;
                } else {
                    publicationsGrid.innerHTML = '<p>No se encontraron publicaciones.</p>';
                }
            })
            .catch(error => {
                console.error('Error al cargar las publicaciones:', error);
                publicationsGrid.innerHTML = '<p>Error al cargar las publicaciones.</p>';
            });
    }

    // Cargar las publicaciones al cargar la página
    loadPublications();

    // **Opcional: Implementación de "infinite scroll" con la API**
    let loadingMore = false;
    let page = 1; // Puedes necesitar un sistema de paginación en tu API
    const limit = 10; // Número de publicaciones a cargar por página (ajusta según tu API)

    function loadMorePublications() {
        if (loadingMore) return;
        loadingMore = true;
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.textContent = 'Cargando más publicaciones...';
        publicationsGrid.appendChild(loadingIndicator);

        fetch(`/BIZZFIZZ/api/publicacion/getAllPublicacionActiva?page=${page}&limit=${limit}`) // Ajusta la URL de paginación si es necesario
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                loadingIndicator.remove();
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(publication => {
                        const card = createPublicationCard(publication);
                        publicationsGrid.appendChild(card);
                    });
                    page++;
                } else if (page === 1 && data && data.mensaje) {
                    publicationsGrid.innerHTML = `<p>${data.mensaje}</p>`;
                } else {
                    // No más publicaciones o un mensaje indicándolo
                    const noMore = document.createElement('div');
                    noMore.className = 'loading-indicator';
                    noMore.textContent = 'No hay más publicaciones para mostrar.';
                    publicationsGrid.appendChild(noMore);
                    window.removeEventListener('scroll', handleScroll); // Dejar de escuchar el scroll
                }
                loadingMore = false;
            })
            .catch(error => {
                console.error('Error al cargar más publicaciones:', error);
                loadingIndicator.textContent = 'Error al cargar las publicaciones.';
                loadingMore = false;
            });
    }

    function handleScroll() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
            loadMorePublications();
        }
    }

    // Comentar o descomentar la siguiente línea para habilitar o deshabilitar el "infinite scroll"
    // window.addEventListener('scroll', handleScroll);
});
