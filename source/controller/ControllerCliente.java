package controller;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.result.InsertOneResult;

import com.mongodb.client.model.Updates;
import com.mongodb.client.result.InsertOneResult;
import com.mongodb.client.result.UpdateResult;
import db.ConexionMongoDB;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import model.Cliente;
import model.Usuario;
import org.bson.Document;
import org.bson.conversions.Bson;

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

    
    public Cliente obtenerClientePorNombreUsuario(String nombreUsuario) {
    ConexionMongoDB conexion = new ConexionMongoDB();
    MongoDatabase database = conexion.open();
    MongoCollection<Cliente> collectionCliente = database.getCollection("cliente", Cliente.class); // Usa Negocio.class

    Bson filtro = Filters.eq("usuario.nombre_usuario", nombreUsuario);
    Cliente cliente = collectionCliente.find(filtro).first(); // Obtiene el primer documento como Negocio

    conexion.close();
    return cliente;
}
   
    public boolean actualizarFotoPerfilCliente(String nombreUsuario, String nuevaFotoPerfil) {
        ConexionMongoDB conexion = new ConexionMongoDB();
        MongoDatabase database = conexion.open();
        MongoCollection<Cliente> collectionCliente = database.getCollection("cliente", Cliente.class);

        Bson filtro = Filters.eq("usuario.nombre_usuario", nombreUsuario);
        Bson actualizacion = Updates.set("foto_perfil", nuevaFotoPerfil); // "foto_perfil" debe coincidir con el campo en tu modelo Cliente

        try {
            collectionCliente.updateOne(filtro, actualizacion);
            conexion.close();
            return true; // Indica que la actualización fue exitosa
        } catch (Exception e) {
            System.err.println("Error al actualizar la foto de perfil del cliente: " + e.getMessage());
            conexion.close();
            return false; // Indica que hubo un error
        }
    }
    
    
    public boolean eliminarCliente(String nombreCliente) {
        ConexionMongoDB conexion = new ConexionMongoDB();
        MongoDatabase database = conexion.open();
        MongoCollection<Document> collectionUsuario = database.getCollection("usuario");
        MongoCollection<Document> collectionCliente = database.getCollection("cliente");

        try {
            // 1. Actualizar el 'activo' del usuario asociado en la colección 'usuario'
            Bson filtroUsuario = Filters.eq("nombre_usuario", nombreCliente);
            Bson actualizacionUsuario = Updates.set("activo", false);
            UpdateResult resultadoUsuario = collectionUsuario.updateOne(filtroUsuario, actualizacionUsuario);

            // 2. Actualizar el 'activo' del cliente en la colección 'cliente'
            Bson filtroCliente = Filters.eq("usuario.nombre_usuario", nombreCliente);
            Bson actualizacionCliente = Updates.set("usuario.activo", false); // Actualiza el 'activo' dentro del subdocumento 'usuario'
            UpdateResult resultadoCliente = collectionCliente.updateOne(filtroCliente, actualizacionCliente);

            // Consideramos exitoso si al menos un documento fue modificado en ambas colecciones
            return resultadoUsuario.getModifiedCount() > 0 && resultadoCliente.getModifiedCount() > 0;

        } finally {
            conexion.close();
        }
    }
    
}
