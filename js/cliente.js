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

    const nombre_cliente = document.getElementById("client-name").value;
    const apellido_paterno = document.getElementById("client-lastP").value;
    const apellido_materno = document.getElementById("client-lastM").value;
    const correo_electronico = document.getElementById("client-email").value;
    const contrasenia = document.getElementById("client-password").value;
    const confirmarContrasenia = document.getElementById("client-confirm-password").value;
    const terminosAceptados = document.getElementById("client-terms").checked;

    if (contrasenia !== confirmarContrasenia) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    if (!terminosAceptados) {
        alert("Debes aceptar los términos y condiciones.");
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
            throw new Error(`Error al registrar cliente: ${errorData.mensaje || response.statusText}`);
        }

        alert("Cliente registrado correctamente.");
        cargarClientes(); // Recargar la lista de clientes
        limpiar(); // Limpiar los campos del formulario después del registro exitoso

    } catch (error) {
        console.error("Error al registrar cliente:", error);
        alert("Error al registrar cliente. Por favor, inténtalo de nuevo.");
    }
}

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