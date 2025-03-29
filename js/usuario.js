document.addEventListener("DOMContentLoaded", () => {
    cargarUsuarios();
});

async function cargarUsuarios() {
    let URL = "http://localhost:8080/BIZZFIZZ/api/usuario/getAllUsuario";
    const usuariosList = document.getElementById("usuarios-list");

    try {
        let response = await fetch(URL);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        let usuarios = await response.json();
        usuariosList.innerHTML = '';

        usuarios.forEach(usuario => {
            let card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <h3>${usuario.nombre}</h3>
                <p><strong>ID:</strong> ${usuario.correo_electronico}</p>
                <p><strong>Teléfono:</strong> ${usuario.tipo_usuario}</p>
                <p><strong>Foto Perfil:</strong> ${usuario.fecha_registro}</p>
            `;
            usuariosList.appendChild(card);
        });

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}
