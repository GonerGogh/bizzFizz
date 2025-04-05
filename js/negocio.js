document.addEventListener("DOMContentLoaded", () => {
    
    cargarCategorias();
    setupFormularios();
    cargarNegocios();
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

async function registrarNegocio(event) {
    event.preventDefault();

    const nombre_negocio = document.getElementById("business-name").value;
    const tipo_negocio = document.getElementById("business-type").value;
    const sitio_web = document.getElementById("business-website").value;
    const telefono_contacto = document.getElementById("business-phone").value;
    const whatsapp = document.getElementById("business-whatsapp").value;
    const nombre_categoria = document.getElementById("business-category").value;
    const correo_electronico = document.getElementById("business-email").value;
    const contrasenia = document.getElementById("business-password").value;
    const pais = document.getElementById("business-country").value;
    const estado = document.getElementById("business-state").value;
    const ciudad = document.getElementById("business-city").value;
    const codigo_postal = document.getElementById("business-postal-code").value;
    const colonia = document.getElementById("business-neighborhood").value;
    const calle = document.getElementById("business-street").value;
    const terminosAceptados = document.getElementById("business-terms").checked;

    if (!terminosAceptados) {
        alert("Debes aceptar los términos y condiciones.");
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
            telefono_contacto : telefono_contacto,
            whatsapp : whatsapp,
            pais: pais,
            estado: estado,
            ciudad: ciudad,
            codigo_postal: codigo_postal,
            colonia: colonia,
            calle: calle
        };
        
        console.log("Telefono de contacto:", telefono_contacto);
        console.log("WhatsApp:", whatsapp);

        let URL = "http://localhost:8080/BIZZFIZZ/api/negocio/agregarNegocio";
        let response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(negocio)
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        alert("Negocio registrado con éxito.");
        // Redirigir o limpiar el formulario
    } catch (error) {
        console.error("Error al registrar negocio:", error);
        alert("Error al registrar negocio. Inténtalo de nuevo.");
    }
}

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
                <p><strong>Teléfono:</strong> ${negocio.telefono}</p>
            `;
            negociosList.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar negocios:", error);
    }
}

