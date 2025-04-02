document.addEventListener('DOMContentLoaded', function() {
    
    
    
    
    // Referencias a elementos del DOM
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const clientRegisterForm = document.getElementById('client-register-form');
    const businessRegisterForm1 = document.getElementById('business-register-form-page1');
    const businessRegisterForm2 = document.getElementById('business-register-form-page2');
    const clientBtn = document.getElementById('client-btn');
    const businessBtn = document.getElementById('business-btn');
    const userTypeSelector = document.querySelector('.user-type-selector');
    const businessNextBtn = document.getElementById('business-next-btn');
    const businessBackBtn = document.getElementById('business-back-btn');
    const businessType = document.getElementById('business-type');
    const physicalStoreFields = document.getElementById('physical-store-fields');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    // Cambiar entre pestañas de iniciar sesión y registrarse
    loginTab.addEventListener('click', function() {
        this.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'block';
        clientRegisterForm.style.display = 'none';
        businessRegisterForm1.style.display = 'none';
        businessRegisterForm2.style.display = 'none';
        userTypeSelector.style.display = 'none';
        
        // Añadir clase para animación
        loginForm.classList.add('active-form');
    });
    
    registerTab.addEventListener('click', function() {
        this.classList.add('active');
        loginTab.classList.remove('active');
        loginForm.style.display = 'none';
        
        // Mostrar selector de tipo de usuario
        userTypeSelector.style.display = 'block';
        
        // Mostrar formulario según el tipo de usuario seleccionado
        if (clientBtn.classList.contains('active')) {
            clientRegisterForm.style.display = 'block';
            clientRegisterForm.classList.add('active-form');
        } else {
            businessRegisterForm1.style.display = 'block';
            businessRegisterForm1.classList.add('active-form');
        }
    });
    
    // Cambiar entre tipo de usuario cliente y negocio
    clientBtn.addEventListener('click', function() {
        this.classList.add('active');
        businessBtn.classList.remove('active');
        clientRegisterForm.style.display = 'block';
        businessRegisterForm1.style.display = 'none';
        businessRegisterForm2.style.display = 'none';
        
        // Añadir clase para animación
        clientRegisterForm.classList.add('active-form');
    });
    
    businessBtn.addEventListener('click', function() {
        this.classList.add('active');
        clientBtn.classList.remove('active');
        clientRegisterForm.style.display = 'none';
        businessRegisterForm1.style.display = 'block';
        businessRegisterForm2.style.display = 'none';
        
        // Añadir clase para animación
        businessRegisterForm1.classList.add('active-form');
    });
    
    // Navegación entre páginas del formulario de negocios
    businessNextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validar campos del formulario página 1
        if (validateBusinessForm1()) {
            businessRegisterForm1.style.display = 'none';
            businessRegisterForm2.style.display = 'block';
            
            // Comprobar si es tienda física u online para mostrar/ocultar campos
            if (businessType.value === 'online') {
                const fields = physicalStoreFields.querySelectorAll('input');
                fields.forEach(field => {
                    field.required = false;
                });
                
                // Alertar al usuario
                Swal.fire({
                    title: 'Información',
                    text: 'Como seleccionaste venta minorista en línea, los campos de dirección son opcionales.',
                    icon: 'info',
                    confirmButtonColor: '#4361ee'
                });
            } else {
                const fields = physicalStoreFields.querySelectorAll('input');
                fields.forEach(field => {
                    field.required = true;
                });
            }
            
            // Añadir clase para animación
            businessRegisterForm2.classList.add('active-form');
        }
    });
    
    businessBackBtn.addEventListener('click', function(e) {
        e.preventDefault();
        businessRegisterForm2.style.display = 'none';
        businessRegisterForm1.style.display = 'block';
        
        // Añadir clase para animación
        businessRegisterForm1.classList.add('active-form');
    });
    
    // Función para validar el formulario de negocio página 1
    function validateBusinessForm1() {
        const businessName = document.getElementById('business-name');
        const businessTypeSelect = document.getElementById('business-type');
        const businessCategory = document.getElementById('business-category');
        const businessEmail = document.getElementById('business-email');
        const businessPassword = document.getElementById('business-password');
        const businessConfirmPassword = document.getElementById('business-confirm-password');
        
        // Validar campos requeridos
        if (!businessName.value.trim()) {
            showError(businessName, 'Por favor, introduce el nombre del negocio');
            return false;
        }
        
        if (!businessTypeSelect.value) {
            showError(businessTypeSelect, 'Por favor, selecciona un tipo de negocio');
            return false;
        }
        
        if (!businessCategory.value) {
            showError(businessCategory, 'Por favor, selecciona una categoría');
            return false;
        }
        
        // Validar email
        if (!validateEmail(businessEmail.value)) {
            showError(businessEmail, 'Por favor, introduce un correo electrónico válido');
            return false;
        }
        
        // Validar contraseña
        if (!validatePassword(businessPassword.value)) {
            showError(businessPassword, 'La contraseña no cumple con los requisitos');
            return false;
        }
        
        // Validar que las contraseñas coincidan
        if (businessPassword.value !== businessConfirmPassword.value) {
            showError(businessConfirmPassword, 'Las contraseñas no coinciden');
            return false;
        }
        
        return true;
    }
    
    // Mostrar/ocultar contraseña
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    });
    
    // Validación de contraseña en tiempo real
    const passwordInputs = document.querySelectorAll('[id$="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            const form = this.closest('form');
            const formType = form.id.includes('client') ? 'client-' : 'business-';
            const lengthCheck = document.getElementById(formType + 'length-check') || document.getElementById('length-check');
            const uppercaseCheck = document.getElementById(formType + 'uppercase-check') || document.getElementById('uppercase-check');
            const lowercaseCheck = document.getElementById(formType + 'lowercase-check') || document.getElementById('lowercase-check');
            const numberCheck = document.getElementById(formType + 'number-check') || document.getElementById('number-check');
            const specialCheck = document.getElementById(formType + 'special-check') || document.getElementById('special-check');
            const progressBar = form.querySelector('.progress-bar');
            
            if (!lengthCheck) return; // Si no encontramos los elementos, salimos
            
            const password = this.value;
            let strength = 0;
            
            // Verificar longitud
            if (password.length >= 8) {
                lengthCheck.classList.add('valid');
                strength += 20;
            } else {
                lengthCheck.classList.remove('valid');
            }
            
            // Verificar mayúsculas
            if (/[A-Z]/.test(password)) {
                uppercaseCheck.classList.add('valid');
                strength += 20;
            } else {
                uppercaseCheck.classList.remove('valid');
            }
            
            // Verificar minúsculas
            if (/[a-z]/.test(password)) {
                lowercaseCheck.classList.add('valid');
                strength += 20;
            } else {
                lowercaseCheck.classList.remove('valid');
            }
            
            // Verificar números
            if (/[0-9]/.test(password)) {
                numberCheck.classList.add('valid');
                strength += 20;
            } else {
                numberCheck.classList.remove('valid');
            }
            
            // Verificar caracteres especiales
            if (/[^A-Za-z0-9]/.test(password)) {
                specialCheck.classList.add('valid');
                strength += 20;
            } else {
                specialCheck.classList.remove('valid');
            }
            
            // Actualizar barra de progreso
            progressBar.style.width = strength + '%';
            
            // Cambiar color según la fuerza
            if (strength <= 40) {
                progressBar.style.backgroundColor = '#f44336'; // Rojo - Débil
            } else if (strength <= 80) {
                progressBar.style.backgroundColor = '#ff9800'; // Naranja - Moderado
            } else {
                progressBar.style.backgroundColor = '#4caf50'; // Verde - Fuerte
            }
        });
    });
    
    // Validación de email en tiempo real
    const emailInputs = document.querySelectorAll('[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!validateEmail(this.value) && this.value) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid');
        });
    });
    
    // Cambiar requisitos de campos en base al tipo de negocio
    businessType.addEventListener('change', function() {
        if (this.value === 'online') {
            const fieldsContainer = document.querySelector('#physical-store-fields');
            fieldsContainer.querySelectorAll('input').forEach(input => {
                input.required = false;
                const label = input.previousElementSibling;
                if (label && label.textContent) {
                    if (!label.textContent.includes('(opcional)')) {
                        label.textContent = label.textContent + ' (opcional)';
                    }
                }
            });
        } else {
            const fieldsContainer = document.querySelector('#physical-store-fields');
            fieldsContainer.querySelectorAll('input').forEach(input => {
                input.required = true;
                const label = input.previousElementSibling;
                if (label && label.textContent) {
                    label.textContent = label.textContent.replace(' (opcional)', '');
                }
            });
        }
    });
    
    // ... (resto del código JavaScript)

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:8080/BIZZFIZZ/api/usuario/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw err;
            });
        }
        return response.json();
    })
    .then(data => {
        // Mostrar alerta de bienvenida con el nombre del usuario
        Swal.fire({
            title: '¡Bienvenido ' + data.nombre + '!',
            icon: 'success',
            confirmButtonColor: '#4361ee'
        }).then(() => {
            // Redirigir según el tipo de usuario
            if (data.tipo_usuario === 'cliente') {
                window.location.href = 'home_cliente.html'; // Redirige a la página del cliente
            } else if (data.tipo_usuario === 'negocio') {
                window.location.href = 'home_negocio.html'; // Redirige a la página del negocio
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Tipo de usuario desconocido.',
                    icon: 'error',
                    confirmButtonColor: '#4361ee'
                });
            }
        });

    })
    .catch(error => {
        let mensajeError = error.mensaje || 'Error al iniciar sesión. Verifica tus credenciales.';

        if (error.mensaje === "Cuenta inactiva. Contacte al administrador."){
            mensajeError = error.mensaje;
        }

        Swal.fire({
            title: 'Error',
            text: mensajeError,
            icon: 'error',
            confirmButtonColor: '#4361ee'
        });
    });
});
        
       
      function limpiar() {
    // Limpiar los campos de texto
    document.getElementById("client-name").value = "";
    document.getElementById("client-lastP").value = "";
    document.getElementById("client-lastM").value = "";
    document.getElementById("client-email").value = "";
    document.getElementById("client-password").value = "";

    // Restablecer los campos de selección a la opción predeterminada
    document.getElementById("client-confirm-password").value = ""; // "Selecciona un estado"
    document.getElementById("client-terms").value = ""; // "Selecciona una ciudad"
}

    
    
    
    // Manejar envío formulario negocio final
    document.getElementById('business-register-form-page2').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener todos los datos
        const businessName = document.getElementById('business-name').value;
        const businessType = document.getElementById('business-type').value;
        const businessWebsite = document.getElementById('business-website').value;
        const businessCategory = document.getElementById('business-category').value;
        const businessEmail = document.getElementById('business-email').value;
        const businessPassword = document.getElementById('business-password').value;
        
        // Datos de dirección
        const country = document.getElementById('business-country').value;
        const state = document.getElementById('business-state').value;
        const city = document.getElementById('business-city').value;
        const postalCode = document.getElementById('business-postal-code').value;
        const neighborhood = document.getElementById('business-neighborhood').value;
        const street = document.getElementById('business-street').value;
        
        const terms = document.getElementById('business-terms').checked;
        
        // Validar términos
        if (!terms) {
            Swal.fire({
                title: 'Error',
                text: 'Debes aceptar los términos y condiciones',
                icon: 'error',
                confirmButtonColor: '#4361ee'
            });
            return;
        }
        
        // Validar campos de dirección para tienda física
        if (businessType === 'local') {
            if (!country || !state || !city || !postalCode || !neighborhood || !street) {
                Swal.fire({
                    title: 'Error',
                    text: 'Para negocios con tienda física, debes completar todos los campos de dirección',
                    icon: 'error',
                    confirmButtonColor: '#4361ee'
                });
                return;
            }
        }
        
        // Crear objeto con todos los datos del negocio
        const businessData = {
            businessName,
            businessType,
            businessWebsite,
            businessCategory,
            businessEmail,
            address: {
                country,
                state,
                city,
                postalCode,
                neighborhood,
                street
            }
        };
        
        // Aquí iría la lógica para registrar negocio con backend
        // Por ahora simulamos una respuesta exitosa
        Swal.fire({
            title: 'Registro Exitoso',
            text: '¡Tu negocio ha sido registrado correctamente!',
            icon: 'success',
            confirmButtonColor: '#4361ee'
        }).then(() => {
            // Redirigir o realizar acciones después del registro
            console.log('Negocio registrado:', businessData);
            
            // Limpiar formularios y volver a la pantalla de login
            document.getElementById('business-register-form-page1').reset();
            this.reset();
            loginTab.click();
        });
    });
    
    // Funciones de utilidad
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function validatePassword(password) {
        // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    }
    
    function showError(input, message) {
        // Marcar campo como inválido
        input.classList.add('is-invalid');
        
        // Buscar o crear elemento de feedback
        let feedback = input.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            input.parentNode.insertBefore(feedback, input.nextSibling);
        }
        
        feedback.textContent = message;
        
        // Mostrar alerta
        Swal.fire({
            title: 'Error',
            text: message,
            icon: 'error',
            confirmButtonColor: '#4361ee'
        });
        
        // Enfocar el input
        input.focus();
    }
    
    // Inicialización - Mostrar formulario de login por defecto
    loginTab.click();
});

