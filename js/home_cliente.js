document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const profileTrigger = document.getElementById('profile-trigger');
    const profileDropdown = document.getElementById('profile-dropdown');
    const favoriteButtons = document.querySelectorAll('.action-button.favorite');

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

    // Funcionalidad de botones de favoritos
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('active');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('active');
            }
        });
    });

    // Simular carga de nuevas publicaciones (para demostración)
    function loadMorePublications() {
        const publicationsGrid = document.querySelector('.publications-grid');
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.textContent = 'Cargando más publicaciones...';
        loadingIndicator.style.textAlign = 'center';
        loadingIndicator.style.padding = '20px';
        loadingIndicator.style.gridColumn = '1 / -1';
        publicationsGrid.appendChild(loadingIndicator);

        // Simular carga con un pequeño retraso
        setTimeout(() => {
            loadingIndicator.remove();

            // Clonar tarjetas existentes para simular la carga de más publicaciones
            const existingCards = document.querySelectorAll('.publication-card');
            const cardsToClone = Array.from(existingCards).slice(0, 2);

            cardsToClone.forEach(card => {
                const clone = card.cloneNode(true);
                const clonedFavoriteButton = clone.querySelector('.action-button.favorite');
                
                // Resetear el estado del botón de favoritos en las tarjetas clonadas
                const favoriteIcon = clonedFavoriteButton.querySelector('i');
                favoriteIcon.className = 'far fa-heart';
                clonedFavoriteButton.classList.remove('active');
                
                // Añadir evento al botón de favoritos clonado
                clonedFavoriteButton.addEventListener('click', function() {
                    const icon = this.querySelector('i');
                    
                    if (icon.classList.contains('far')) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        this.classList.add('active');
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        this.classList.remove('active');
                    }
                });
                
                publicationsGrid.appendChild(clone);
            });
        }, 1500);
    }

    // Implementar "infinite scroll"
    window.addEventListener('scroll', function() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
            // Solo cargar más contenido si no hay ya una carga en progreso
            if (!document.querySelector('.loading-indicator')) {
                loadMorePublications();
            }
        }
    });
});