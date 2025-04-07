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

    // Llamar a la función para obtener los datos del cliente al cargar la página
    fetchUserData();
    // **Simulación de datos del cliente logueado**
    const loggedInClient = {
        nombre: "Nombre del Cliente",
        email: "cliente@email.com",
        fotoPerfil: "imagenes/icono_perfil.png" // Reemplaza con la URL real de la foto
    };

    // **Actualizar la información del perfil en el dropdown**
    if (loggedInClient && loggedInClient.foto_perfil) {
        const profilePic = document.querySelector('.profile-pic');
        if (profilePic) {
            profilePic.src = loggedInClient.foto_perfil;
        }
        profileImageDropdown.src = loggedInClient.foto_perfil;
        profileUsername.textContent = loggedInClient.nombre;
        profileEmail.textContent = loggedInClient.email;
    }

    // Alternar la barra lateral
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('show');
        mainContent.classList.toggle('shifted');
    });

    const logoutButton = document.querySelector('.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
            // Redirigir al usuario a la página de inicio de sesión
            window.location.href = 'index.html';
            localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
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

    // Función para crear una tarjeta de publicación
    function createPublicationCard(publication) {
        const card = document.createElement('div');
        card.className = 'publication-card';

        const header = document.createElement('div');
        header.className = 'publication-header';
        const title = document.createElement('h2');
        title.className = 'publication-title';
        title.textContent = publication.titulo;
        header.appendChild(title);

        const content = document.createElement('div');
        content.className = 'publication-content';
        const imageContainer = document.createElement('div');
        imageContainer.className = 'publication-image';

        // **Implementación del Carrusel Automático si hay múltiples imágenes**
        if (publication.imagen_publicacion && publication.imagen_publicacion.length > 0) {
            const carouselId = `carousel-client-${publication.id_publicacion || Math.random().toString(36).substring(7)}`; // Generar ID único
            imageContainer.innerHTML = `
                <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        ${publication.imagen_publicacion.map((img, index) => `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <img src="${img}" class="d-block w-100" alt="${publication.titulo}">
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            // Necesitas incluir los estilos de Bootstrap para el carrusel (si aún no están)
            const bootstrapCSS = document.querySelector('link[href*="bootstrap"]');
            if (!bootstrapCSS) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
                document.head.appendChild(link);
            }
            // Y también el JS de Bootstrap para la funcionalidad (si aún no está)
            const bootstrapJS = document.querySelector('script[src*="bootstrap"]');
            if (!bootstrapJS) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
                document.body.appendChild(script);
            }

            // Inicializar el carrusel de Bootstrap con intervalo de 2 segundos (2000 ms)
            setTimeout(() => {
                const carouselElement = document.getElementById(carouselId);
                if (carouselElement) {
                    new bootstrap.Carousel(carouselElement, {
                        interval: 2000,
                        ride: 'carousel', // Asegura que el carrusel comience a auto-deslizar
                        touch: false,     // Opcional: Deshabilitar el deslizamiento táctil
                        keyboard: false    // Opcional: Deshabilitar la navegación con teclado
                    });
                }
            }, 0); // Ejecutar después de que el elemento se haya añadido al DOM
        } else if (publication.imagenUrl) {
            // Si solo hay una imagen, mostrarla como antes
            const image = document.createElement('img');
            image.src = publication.imagenUrl;
            image.alt = publication.titulo;
            image.style.width = '100%';
            image.style.height = 'auto';
            image.style.display = 'block';
            image.style.borderRadius = '4px';
            imageContainer.appendChild(image);
        } else {
            // Si no hay imágenes
            const placeholder = document.createElement('div');
            placeholder.textContent = 'Sin imagen disponible';
            placeholder.style.backgroundColor = '#f0f0f0';
            placeholder.style.color = '#777';
            placeholder.style.textAlign = 'center';
            placeholder.style.padding = '20px';
            placeholder.style.borderRadius = '4px';
            imageContainer.appendChild(placeholder);
        }
        content.appendChild(imageContainer);

        const details = document.createElement('div');
        details.className = 'publication-details';
        const description = document.createElement('p');
        description.className = 'publication-description';
        description.textContent = publication.descripcion;
        details.appendChild(description);

        const footer = document.createElement('div');
        footer.className = 'publication-footer';
        const location = document.createElement('div');
        location.className = 'publication-location';
        const locationIcon = document.createElement('i');
        locationIcon.className = 'fas fa-map-marker-alt';
        const locationSpan = document.createElement('span');
        locationSpan.textContent = publication.ubicacion || 'Ubicación no especificada';
        location.appendChild(locationIcon);
        location.appendChild(locationSpan);
        footer.appendChild(location);

        const price = document.createElement('div');
        price.className = 'publication-price';
        const priceSpan = document.createElement('span');
        priceSpan.textContent = publication.precio ? `$${publication.precio}` : 'Precio no disponible';
        price.appendChild(priceSpan);
        footer.appendChild(price);
        details.appendChild(footer);
        content.appendChild(details);
        card.appendChild(header);
        card.appendChild(content);

        const actions = document.createElement('div');
        actions.className = 'publication-actions';
        const favoriteButton = document.createElement('button');
        favoriteButton.className = 'action-button favorite';
        const favoriteIcon = document.createElement('i');
        favoriteIcon.className = 'far fa-heart';
        favoriteButton.appendChild(favoriteIcon);

        const contactButton = document.createElement('a'); // Cambiamos a un elemento <a>
        contactButton.className = 'action-button contact';
        const contactIcon = document.createElement('i');
        contactIcon.className = 'fas fa-phone';
        contactButton.appendChild(contactIcon);
        contactButton.appendChild(document.createTextNode(' Contactar'));

        // **Generar el enlace de WhatsApp dinámicamente con mensaje predeterminado**
        if (publication.negocio && publication.negocio.whatsapp) {
            const whatsappNumber = publication.negocio.whatsapp.replace(/\D/g, ''); // Eliminar caracteres no numéricos
            const mensajePredeterminado = encodeURIComponent(`Hola, estoy interesado en "${publication.titulo}".`);
            contactButton.href = `https://wa.me/${whatsappNumber}?text=${mensajePredeterminado}`;
            contactButton.target = '_blank'; // Abrir en una nueva pestaña
        } else {
            contactButton.disabled = true; // Opcional: Deshabilitar el botón si no hay WhatsApp
            contactButton.style.cursor = 'not-allowed'; // Opcional: Cambiar el cursor
            contactButton.title = 'WhatsApp no disponible'; // Opcional: Agregar un tooltip
        }

        actions.appendChild(favoriteButton);
        actions.appendChild(contactButton);
        card.appendChild(actions);

        // Agregar funcionalidad al botón de favoritos (tu código existente)
        favoriteButton.addEventListener('click', function() {
            if (favoriteIcon.classList.contains('far')) {
                favoriteIcon.classList.remove('far');
                favoriteIcon.classList.add('fas');
                this.classList.add('active');
            } else {
                favoriteIcon.classList.remove('fas');
                favoriteIcon.classList.add('far');
                this.classList.remove('active');
            }
        });

        return card;
    }

    // Función para cargar las publicaciones desde la API
    function loadPublications() {
        fetch('/BIZZFIZZ/api/publicacion/getAllPublicacion') // Ajusta la URL si es diferente
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

        fetch(`/BIZZFIZZ/api/publicacion/getAllPublicacion?page=${page}&limit=${limit}`) // Ajusta la URL de paginación si es necesario
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