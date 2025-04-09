document.addEventListener("DOMContentLoaded", () => {
    cargarClientes();

    const clientRegisterForm = document.getElementById("client-register-form");
    clientRegisterForm.addEventListener("submit", registrarCliente);
});

async function cargarClientes() {
    let URL = "http://localhost:8080/BIZZFIZZ/api/cliente/getAllCliente";
    const clientesList = document.getElementById("clientes-list");

    try {
        let response = await fetch(URL);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        let clientes = await response.json();
        clientesList.innerHTML = '';

        clientes.forEach(cliente => {
            let card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <h3>${cliente.nombre_cliente} ${cliente.apellido_paterno} ${cliente.apellido_materno}</h3>
                <p><strong>ID:</strong> ${cliente.idCliente}</p>
                <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
            `;
            clientesList.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar clientes:", error);
    }
}

async function registrarCliente(event) {
    event.preventDefault();

    const nombre_cliente_input = document.getElementById("client-name");
    const apellido_paterno_input = document.getElementById("client-lastP");
    const apellido_materno_input = document.getElementById("client-lastM");
    const correo_electronico = document.getElementById("client-email").value;
    const contrasenia = document.getElementById("client-password").value;
    const confirmarContrasenia = document.getElementById("client-confirm-password").value;
    const terminosAceptados = document.getElementById("client-terms").checked;

    const nombre_cliente = nombre_cliente_input.value.trim();
    const apellido_paterno = apellido_paterno_input.value.trim();
    const apellido_materno = apellido_materno_input.value.trim();

    // Validación de solo letras
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!soloLetrasRegex.test(nombre_cliente)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El nombre solo debe contener letras.',
        });
        return;
    }

    if (!soloLetrasRegex.test(apellido_paterno)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El apellido paterno solo debe contener letras.',
        });
        return;
    }

    if (!soloLetrasRegex.test(apellido_materno)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El apellido materno solo debe contener letras.',
        });
        return;
    }

    if (contrasenia !== confirmarContrasenia) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden.',
        });
        return;
    }

    if (!terminosAceptados) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Debes aceptar los términos y condiciones.',
        });
        return;
    }

    const cliente = {
        nombre_cliente: nombre_cliente,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        telefono: "1234567890", // Puedes agregar un campo de teléfono en el formulario si es necesario
        usuario: {
            correo_electronico: correo_electronico,
            contrasenia: contrasenia
        }
    };

    try {
        let URL = "http://localhost:8080/BIZZFIZZ/api/cliente/agregarCliente";
        let response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        if (!response.ok) {
            const errorData = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: errorData.mensaje || response.statusText,
            });
            throw new Error(`Error al registrar cliente: ${errorData.mensaje || response.statusText}`);
        }

        Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'Cliente registrado correctamente.',
            showConfirmButton: false,
            timer: 1500 // Opcional: cerrar automáticamente después de 1.5 segundos
        }).then(() => {
            cargarClientes(); // Recargar la lista de clientes
            limpiar(); // Limpiar los campos del formulario después del registro exitoso
        });

    } catch (error) {
        console.error("Error al registrar cliente:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al registrar cliente. Por favor, inténtalo de nuevo.',
        });
    }
}

// Event listeners para evitar la entrada de números en los campos de nombre y apellidos
document.addEventListener('DOMContentLoaded', () => {
    const nombreInput = document.getElementById("client-name");
    const apellidoPInput = document.getElementById("client-lastP");
    const apellidoMInput = document.getElementById("client-lastM");
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/; // Permitimos también espacios

    nombreInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    });

    apellidoPInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    });

    apellidoMInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    });
});

// Event listeners para evitar la entrada de números en los campos de nombre y apellidos
document.addEventListener('DOMContentLoaded', () => {
    const nombreInput = document.getElementById("client-name");
    const apellidoPInput = document.getElementById("client-lastP");
    const apellidoMInput = document.getElementById("client-lastM");
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/; // Permitimos también espacios

    nombreInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    });

    apellidoPInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    });

    apellidoMInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    });
});

function limpiar() {
    // Limpiar los campos de texto
    document.getElementById("client-name").value = "";
    document.getElementById("client-lastP").value = "";
    document.getElementById("client-lastM").value = "";
    document.getElementById("client-email").value = "";
    document.getElementById("client-password").value = "";
    document.getElementById("client-confirm-password").value = "";
    document.getElementById("client-terms").checked = false; // Desmarcar el checkbox de términos
}
