document.addEventListener("DOMContentLoaded", () => {

    cargarCategorias();
    setupFormularios();
    cargarNegocios();
    setupPhoneFormat("business-phone");
    setupPhoneFormat("business-whatsapp");

    // **NUEVO:** Inicializar data-raw-number si no existe
    const phoneInput = document.getElementById("business-phone");
    if (!phoneInput.dataset.rawNumber) {
        phoneInput.dataset.rawNumber = '';
    }

    const whatsappInput = document.getElementById("business-whatsapp");
    if (!whatsappInput.dataset.rawNumber) {
        whatsappInput.dataset.rawNumber = '';
    }
});

async function cargarCategorias() {
    let URL = "http://localhost:8080/BIZZFIZZ/api/categoria/getAllCategoria";
    const categoriaSelect = document.getElementById("business-category");

    try {
        let response = await fetch(URL);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        let categorias = await response.json();
        console.log("Categorías obtenidas:", categorias); // Verifica las categorías obtenidas

        categoriaSelect.innerHTML = '<option value="" selected disabled>Selecciona una categoría</option>';

        categorias.forEach(categoria => {
            console.log("Categoría actual:", categoria); // Verifica cada categoría en el bucle
            let option = document.createElement("option");
            option.value = categoria.nombre_categoria;
            option.textContent = categoria.nombre_categoria;
            categoriaSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}

function setupFormularios() {
    const formPage1 = document.getElementById("business-register-form-page1");
    const formPage2 = document.getElementById("business-register-form-page2");
    const nextBtn = document.getElementById("business-next-btn");
    const backBtn = document.getElementById("business-back-btn");

    nextBtn.addEventListener("click", () => {
        if (formPage1.checkValidity()) {
            formPage1.style.display = "none";
            formPage2.style.display = "block";
        }
    });

    backBtn.addEventListener("click", () => {
        formPage2.style.display = "none";
        formPage1.style.display = "block";
    });

    formPage2.addEventListener("submit", registrarNegocio);
}

function setupPhoneFormat(inputId) {
    const input = document.getElementById(inputId);
    const placeholderText = "Escribe tu número con lada (+xx xxx-xxx-xxxx)";
    input.placeholder = placeholderText;

    input.addEventListener("input", function() {
        let value = this.value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
        let formattedValue = '';
        let rawNumber = '';

        if (value.startsWith('+')) {
            value = value.substring(1); // Eliminar el signo '+' temporalmente para el formato
        }

        if (value.length > 0) {
            formattedValue += '+';
            rawNumber += value.substring(0, 2);
            formattedValue += value.substring(0, 2);
        }
        if (value.length > 2) {
            formattedValue += ' ';
            rawNumber += value.substring(2, 5);
            formattedValue += value.substring(2, 5);
        }
        if (value.length > 5) {
            formattedValue += '-';
            rawNumber += value.substring(5, 8);
            formattedValue += value.substring(5, 8);
        }
        if (value.length > 8) {
            formattedValue += '-';
            rawNumber += value.substring(8, 12);
            formattedValue += value.substring(8, 12);
        }

        this.value = formattedValue.substring(0, 18); // Limitar la longitud del input con formato
        this.dataset.rawNumber = rawNumber.substring(0, 12); // Guardar solo los 12 números
    });

    input.addEventListener("blur", function() {
        if (this.value === '+') {
            this.value = ''; // Limpiar si solo se escribió el '+'
            this.dataset.rawNumber = ''; // **NUEVO:** Limpiar rawNumber si se borra el '+'
        } else if (!this.value) {
            this.dataset.rawNumber = ''; // **NUEVO:** Asegurar que rawNumber esté vacío si el input está vacío
        }
    });

    // **NUEVO:** Inicializar dataset.rawNumber al cargar la página
    input.dataset.rawNumber = '';
};

async function registrarNegocio(event) {
    event.preventDefault();

    const nombre_negocio = document.getElementById("business-name").value;
    const tipo_negocio = document.getElementById("business-type").value;
    const sitio_web = document.getElementById("business-website").value;
    const telefono_contacto_formatted = document.getElementById("business-phone").value;
    const whatsapp_formatted = document.getElementById("business-whatsapp").value;
    const telefono_contacto = document.getElementById("business-phone").dataset.rawNumber || '';
    const whatsapp = document.getElementById("business-whatsapp").dataset.rawNumber || '';
    const nombre_categoria = document.getElementById("business-category").value;
    const correo_electronico = document.getElementById("business-email").value;
    const contrasenia = document.getElementById("business-password").value;
    const pais_input = document.getElementById("business-country");
    const estado_input = document.getElementById("business-state");
    const ciudad_input = document.getElementById("business-city");
    const codigo_postal = document.getElementById("business-postal-code").value;
    const colonia = document.getElementById("business-neighborhood").value;
    const calle = document.getElementById("business-street").value;
    const terminosAceptados = document.getElementById("business-terms").checked;

    const pais = pais_input.value.trim();
    const estado = estado_input.value.trim();
    const ciudad = ciudad_input.value.trim();

    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (pais && !soloLetrasRegex.test(pais)) {
        alert("El país solo debe contener letras.");
        return;
    }

    if (estado && !soloLetrasRegex.test(estado)) {
        alert("El estado solo debe contener letras.");
        return;
    }

    if (ciudad && !soloLetrasRegex.test(ciudad)) {
        alert("La ciudad solo debe contener letras.");
        return;
    }

    if (!terminosAceptados) {
        alert("Debes aceptar los términos y condiciones.");
        return;
    }

    // Validación de número de teléfono (ahora opcional)
    if (telefono_contacto && telefono_contacto.length > 0 && (telefono_contacto.length !== 12 || !/^\d{2}\d{10}$/.test(telefono_contacto))) {
        alert("El número de teléfono debe tener 12 dígitos (lada + 10 dígitos).");
        return;
    }

    // Validación de WhatsApp (ahora opcional)
    if (whatsapp && whatsapp.length > 0 && (whatsapp.length !== 12 || !/^\d{2}\d{10}$/.test(whatsapp))) {
        alert("El número de WhatsApp debe tener 12 dígitos (lada + 10 dígitos).");
        return;
    }

    try {
        // Obtener la categoría completa desde la API
        const categoria = await obtenerCategoria(nombre_categoria);

        const negocio = {
            nombre_negocio: nombre_negocio,
            tipo_negocio: tipo_negocio,
            sitio_web: sitio_web,
            categoria: categoria,
            usuario: {
                correo_electronico: correo_electronico,
                contrasenia: contrasenia
            },
            telefono_contacto: telefono_contacto || null, // Guardar null si está vacío
            whatsapp: whatsapp || null, // Guardar null si está vacío
            pais: pais || null, // Guardar null si está vacío si no se llenó
            estado: estado || null, // Guardar null si está vacío si no se llenó
            ciudad: ciudad || null, // Guardar null si está vacío si no se llenó
            codigo_postal: codigo_postal,
            colonia: colonia,
            calle: calle
        };

        console.log("Telefono de contacto (raw):", telefono_contacto);
        console.log("WhatsApp (raw):", whatsapp);

        let URL = "http://localhost:8080/BIZZFIZZ/api/negocio/agregarNegocio";
        let response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(negocio)
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    } catch (error) {
        console.error("Error al registrar negocio:", error);
        alert("Error al registrar negocio. Inténtalo de nuevo.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const paisInput = document.getElementById("business-country");
    const estadoInput = document.getElementById("business-state");
    const ciudadInput = document.getElementById("business-city");
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;

    paisInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    });

    estadoInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    });

    ciudadInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    });
});

async function obtenerCategoria(nombre_categoria) {
    let URL = `http://localhost:8080/BIZZFIZZ/api/categoria/getCategoriaByName/${nombre_categoria}`;

    try {
        let response = await fetch(URL);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener categoría:", error);
        throw error;
    }
}


async function cargarNegocios() {
    let URL = "http://localhost:8080/BIZZFIZZ/api/negocio/getAllNegocio";
    const negociosList = document.getElementById("negocios-list");

    try {
        let response = await fetch(URL);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        let negocios = await response.json();
        negociosList.innerHTML = '';

        negocios.forEach(negocio => {
            let card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <h3>${negocio.nombre} ${negocio.apellido_paterno} ${negocio.apellido_materno}</h3>
                <p><strong>ID:</strong> ${negocio.idCliente}</p>
                <p><strong>Teléfono:</strong> ${negocio.telefono_contacto}</p>
                <p><strong>WhatsApp:</strong> ${negocio.whatsapp}</p>
            `;
            negociosList.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar negocios:", error);
    }
}
