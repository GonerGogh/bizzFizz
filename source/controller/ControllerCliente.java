package controller;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.InsertOneResult;
import db.ConexionMongoDB;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import model.Cliente;
import model.Usuario;
import org.bson.Document;

/**
 *
 * @author flore
 */
public class ControllerCliente {
    
   public boolean agregarCliente(Cliente cliente) {

    ConexionMongoDB conexion = new ConexionMongoDB();
    MongoDatabase database = conexion.open();
    MongoCollection<Document> collectionCliente = database.getCollection("cliente");
    MongoCollection<Document> collectionUsuario = database.getCollection("usuario");

    // 1. Obtener el último ID de usuario y cliente, y generar los nuevos IDs
    int idUsuario = obtenerUltimoId(collectionUsuario) + 1;
    int idCliente = obtenerUltimoId(collectionCliente) + 1;

    // 2. Crear el nombre de usuario
    String nombreUsuario = cliente.getNombre_cliente()+ cliente.getApellido_paterno().substring(0, 1) + cliente.getApellido_materno().substring(0, 1);

    // 3. Crear el documento para el usuario
    Document documentoUsuario = new Document()
            .append("id_usuario", idUsuario)
            .append("nombre_usuario", nombreUsuario)
            .append("correo_electronico", cliente.getUsuario().getCorreo_electronico())
            .append("contrasenia", cliente.getUsuario().getContrasenia())
            .append("tipo_usuario", "cliente")
            .append("fecha_registro", new Date())
            .append("activo", true);

    // 4. Insertar el documento del usuario
    InsertOneResult resultUsuario = collectionUsuario.insertOne(documentoUsuario);
    boolean resultadoUsuario = resultUsuario.getInsertedId() != null;

    if (!resultadoUsuario) {
        conexion.close();
        return false; // Si falla el registro del usuario, falla todo
    }

    // 5. Crear el documento para el cliente
    Document documentoCliente = new Document()
            .append("id_cliente", idCliente)
            .append("usuario", new Document()
                    .append("id_usuario", idUsuario)
                    .append("nombre_usuario", nombreUsuario)
                    .append("correo_electronico", cliente.getUsuario().getCorreo_electronico())
                    .append("contrasenia", cliente.getUsuario().getContrasenia())
                    .append("tipo_usuario", "cliente")
                    .append("fecha_registro", new Date())
                    .append("activo", true))
            .append("nombre_cliente", cliente.getNombre_cliente())
            .append("apellido_paterno", cliente.getApellido_paterno())
            .append("apellido_materno", cliente.getApellido_materno())
            .append("telefono", cliente.getTelefono());

    // 6. Insertar el documento del cliente
    InsertOneResult resultCliente = collectionCliente.insertOne(documentoCliente);
    boolean resultadoCliente = resultCliente.getInsertedId() != null;

    conexion.close();
    return resultadoCliente; // Devuelve true si ambos registros fueron exitosos
}

// Método auxiliar para obtener el último ID insertado en una colección
private int obtenerUltimoId(MongoCollection<Document> collection) {
    Document ultimoDocumento = collection.find().sort(new Document("_id", -1)).first();
    if (ultimoDocumento != null && ultimoDocumento.containsKey("id_usuario")) {
        return ultimoDocumento.getInteger("id_usuario");
    } else if (ultimoDocumento != null && ultimoDocumento.containsKey("id_cliente")) {
        return ultimoDocumento.getInteger("id_cliente");
    } else {
        return 0; // Si no hay documentos, el ID inicial es 0
    }
}


    // Método para obtener todos los productos de maquillaje
    public List<Cliente> obtenerCliente() {
        ConexionMongoDB conexion = new ConexionMongoDB();
        MongoDatabase database = conexion.open();
        MongoCollection<Cliente> collection = database.getCollection("cliente", Cliente.class);

        List<Cliente> listaClientes = new ArrayList<>();
        collection.find().into(listaClientes);

        conexion.close();
        return listaClientes;
    }

   
    
}
