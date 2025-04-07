
package controller;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import com.mongodb.client.result.InsertOneResult;
import com.mongodb.client.result.UpdateResult;
import db.ConexionMongoDB;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import model.Categoria;
import model.Negocio;
import org.bson.Document;
import org.bson.conversions.Bson;

/**
 *
 * @author flore
 */
public class ControllerNegocio {
    
    
    public boolean agregarNegocio(Negocio negocio) {

    ConexionMongoDB conexion = new ConexionMongoDB();
    MongoDatabase database = conexion.open();
    MongoCollection<Document> collectionNegocio = database.getCollection("negocio");
    MongoCollection<Document> collectionUsuario = database.getCollection("usuario");
    MongoCollection<Document> collectionCategoria = database.getCollection("categoria");
    
    // 1. Obtener el último ID de usuario y cliente, y generar los nuevos IDs
    int idUsuario = obtenerUltimoId(collectionUsuario) + 1;
    int idNegocio = obtenerUltimoId(collectionNegocio) + 1;
    
    // Obtener los datos del luchador"
        Categoria categoria = obtenerCategoriaDesdeDB(negocio.getCategoria().getNombre_categoria(), database);
        if (categoria == null) {
            conexion.close();
            throw new IllegalArgumentException("La categoria no existe en la base de datos");
        }

    // 2. Crear el nombre de usuario
    //String nombreUsuario = cliente.getNombre_cliente()+ cliente.getApellido_paterno().substring(0, 1) + cliente.getApellido_materno().substring(0, 1);

    // 3. Crear el documento para el usuario
    Document documentoUsuario = new Document()
            .append("id_usuario", idUsuario)
            .append("nombre_usuario", negocio.getNombre_negocio())
            .append("correo_electronico", negocio.getUsuario().getCorreo_electronico())
            .append("contrasenia", negocio.getUsuario().getContrasenia())
            .append("tipo_usuario", "negocio")
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
    Document documentoNegocio = new Document()
            .append("id_negocio", idNegocio)
            .append("usuario", new Document()
                    .append("id_usuario", idUsuario)
                    .append("nombre_usuario", negocio.getNombre_negocio())
                    .append("correo_electronico", negocio.getUsuario().getCorreo_electronico())
                    .append("contrasenia", negocio.getUsuario().getContrasenia())
                    .append("tipo_usuario", "negocio")
                    .append("fecha_registro", new Date())
                    .append("activo", true))
            .append("categoria", new Document()
                    .append("id_categoria", negocio.getCategoria().getId_categoria())
                    .append("nombre_categoria", negocio.getCategoria().getNombre_categoria())
                    .append("activo", negocio.getCategoria().getActivo())
             )
            .append("nombre_negocio", negocio.getNombre_negocio())
            .append("tipo_negocio", negocio.getTipo_negocio())
            .append("pais", negocio.getPais())
            .append("estado", negocio.getEstado())
            .append("ciudad", negocio.getCiudad())
            .append("codigo_postal", negocio.getCodigo_postal())
            .append("colonia", negocio.getColonia())
            .append("calle", negocio.getCalle())
            .append("sitio_web", negocio.getSitio_web())
            .append("telefono_contacto", negocio.getTelefono_contacto())
            .append("whatsapp", negocio.getWhatsapp())
            .append("foto_perfil", negocio.getFoto_perfil());

    // 6. Insertar el documento del cliente
    InsertOneResult resultNegocio = collectionNegocio.insertOne(documentoNegocio);
    boolean resultadoNegocio = resultNegocio.getInsertedId() != null;

    conexion.close();
    return resultadoNegocio; // Devuelve true si ambos registros fueron exitosos
}
    
    
    
    
    
    private Categoria obtenerCategoriaDesdeDB(String nombre_categoria, MongoDatabase database) {
    System.out.println("Buscando categoria en la BD: " + nombre_categoria); // Debugging
    MongoCollection<Categoria> categoriaCollection = database.getCollection("categoria", Categoria.class);
    Bson filtro = Filters.eq("nombre_categoria", nombre_categoria); 
    Categoria categoria = categoriaCollection.find(filtro).first(); 

    if (categoria == null) {
        System.out.println("No se encontró la categoria: " + nombre_categoria); // Verifica si el problema está aquí
    }
    
    return categoria;
}
    
    
    // Método auxiliar para obtener el último ID insertado en una colección
private int obtenerUltimoId(MongoCollection<Document> collection) {
    Document ultimoDocumento = collection.find().sort(new Document("_id", -1)).first();
    if (ultimoDocumento != null && ultimoDocumento.containsKey("id_usuario")) {
        return ultimoDocumento.getInteger("id_usuario");
    } else if (ultimoDocumento != null && ultimoDocumento.containsKey("id_negocio")) {
        return ultimoDocumento.getInteger("id_negocio");
    } else {
        return 0; // Si no hay documentos, el ID inicial es 0
    }
}
    
    

public boolean actualizarNegocioPorNombre(Negocio negocio) {
    ConexionMongoDB conexion = new ConexionMongoDB();
    MongoDatabase database = conexion.open();
    MongoCollection<Document> collectionNegocio = database.getCollection("negocio");
    MongoCollection<Document> collectionPublicacion = database.getCollection("publicacion"); // Obtener la colección de publicaciones

    Bson filtroNegocio = Filters.eq("nombre_negocio", negocio.getNombre_negocio());
    List<Bson> updatesListNegocio = new ArrayList<>();
    List<Bson> updatesListPublicacion = new ArrayList<>(); // Lista para las actualizaciones de publicación

    if (negocio.getCategoria() != null) {
        if (negocio.getCategoria().getId_categoria() > 0) {
            updatesListNegocio.add(Updates.set("categoria.id_categoria", negocio.getCategoria().getId_categoria()));
            updatesListPublicacion.add(Updates.set("negocio.categoria.id_categoria", negocio.getCategoria().getId_categoria())); // Actualizar en publicaciones
        }
        if (negocio.getCategoria().getNombre_categoria() != null) {
            updatesListNegocio.add(Updates.set("categoria.nombre_categoria", negocio.getCategoria().getNombre_categoria()));
            updatesListPublicacion.add(Updates.set("negocio.categoria.nombre_categoria", negocio.getCategoria().getNombre_categoria())); // Actualizar en publicaciones
        }
    }
    if (negocio.getPais() != null) {
        updatesListNegocio.add(Updates.set("pais", negocio.getPais()));
        updatesListPublicacion.add(Updates.set("negocio.pais", negocio.getPais())); // Actualizar en publicaciones
    }
    if (negocio.getEstado() != null) {
        updatesListNegocio.add(Updates.set("estado", negocio.getEstado()));
        updatesListPublicacion.add(Updates.set("negocio.estado", negocio.getEstado())); // Actualizar en publicaciones
    }
    if (negocio.getCiudad() != null) {
        updatesListNegocio.add(Updates.set("ciudad", negocio.getCiudad()));
        updatesListPublicacion.add(Updates.set("negocio.ciudad", negocio.getCiudad())); // Actualizar en publicaciones
    }
    if (negocio.getCodigo_postal() != null) {
        updatesListNegocio.add(Updates.set("codigo_postal", negocio.getCodigo_postal()));
        updatesListPublicacion.add(Updates.set("negocio.codigo_postal", negocio.getCodigo_postal())); // Actualizar en publicaciones
    }
    if (negocio.getCalle() != null) {
        updatesListNegocio.add(Updates.set("calle", negocio.getCalle()));
        updatesListPublicacion.add(Updates.set("negocio.calle", negocio.getCalle())); // Actualizar en publicaciones
    }
    if (negocio.getColonia() != null) {
        updatesListNegocio.add(Updates.set("colonia", negocio.getColonia()));
        updatesListPublicacion.add(Updates.set("negocio.colonia", negocio.getColonia())); // Actualizar en publicaciones
    }
    if (negocio.getTelefono_contacto() != null) {
        updatesListNegocio.add(Updates.set("telefono_contacto", negocio.getTelefono_contacto()));
        updatesListPublicacion.add(Updates.set("negocio.telefono_contacto", negocio.getTelefono_contacto())); // Actualizar en publicaciones
    }
    if (negocio.getWhatsapp() != null) {
        updatesListNegocio.add(Updates.set("whatsapp", negocio.getWhatsapp()));
        updatesListPublicacion.add(Updates.set("negocio.whatsapp", negocio.getWhatsapp())); // Actualizar en publicaciones
    }
    if (negocio.getFoto_perfil() != null) {
        updatesListNegocio.add(Updates.set("foto_perfil", negocio.getFoto_perfil()));
        updatesListPublicacion.add(Updates.set("negocio.foto_perfil", negocio.getFoto_perfil())); // Actualizar en publicaciones
    }

    Bson actualizacionesNegocio = Updates.combine(updatesListNegocio);
    Bson actualizacionesPublicacion = Updates.combine(updatesListPublicacion);

    UpdateResult resultadoNegocio = collectionNegocio.updateOne(filtroNegocio, actualizacionesNegocio);
    UpdateResult resultadoPublicacion = collectionPublicacion.updateMany(Filters.eq("negocio.nombre_negocio", negocio.getNombre_negocio()), actualizacionesPublicacion);

    conexion.close();
    // Considera si quieres retornar true solo si ambas actualizaciones fueron exitosas
    return resultadoNegocio.getModifiedCount() > 0 || resultadoPublicacion.getModifiedCount() > 0;
}


public boolean eliminarNegocio(String nombreNegocio) {
        ConexionMongoDB conexion = new ConexionMongoDB();
        MongoDatabase database = conexion.open();
        MongoCollection<Document> collectionUsuario = database.getCollection("usuario");
        MongoCollection<Document> collectionNegocio = database.getCollection("negocio");

        try {
            // 1. Actualizar el 'activo' del usuario asociado en la colección 'usuario'
            Bson filtroUsuario = Filters.eq("nombre_usuario", nombreNegocio);
            Bson actualizacionUsuario = Updates.set("activo", false);
            UpdateResult resultadoUsuario = collectionUsuario.updateOne(filtroUsuario, actualizacionUsuario);

            // 2. Actualizar el 'activo' del negocio en la colección 'negocio'
            Bson filtroNegocio = Filters.eq("nombre_negocio", nombreNegocio);
            Bson actualizacionNegocio = Updates.set("usuario.activo", false); // Actualiza el 'activo' dentro del subdocumento 'usuario'
            UpdateResult resultadoNegocio = collectionNegocio.updateOne(filtroNegocio, actualizacionNegocio);

            // Consideramos exitoso si al menos un documento fue modificado en ambas colecciones
            return resultadoUsuario.getModifiedCount() > 0 && resultadoNegocio.getModifiedCount() > 0;

        } finally {
            conexion.close();
        }
    }

    
    // Método para obtener todos los productos de maquillaje
    public List<Negocio> obtenerNegocio() {
        ConexionMongoDB conexion = new ConexionMongoDB();
        MongoDatabase database = conexion.open();
        MongoCollection<Negocio> collection = database.getCollection("negocio", Negocio.class);

        List<Negocio> listaNegocios = new ArrayList<>();
        collection.find().into(listaNegocios);

        conexion.close();
        return listaNegocios;
    }
    
    
    public Negocio obtenerNegocioPorNombreUsuario(String nombreUsuario) {
    ConexionMongoDB conexion = new ConexionMongoDB();
    MongoDatabase database = conexion.open();
    MongoCollection<Negocio> collectionNegocio = database.getCollection("negocio", Negocio.class); // Usa Negocio.class

    Bson filtro = Filters.eq("nombre_negocio", nombreUsuario);
    Negocio negocio = collectionNegocio.find(filtro).first(); // Obtiene el primer documento como Negocio

    conexion.close();
    return negocio;
}
    
}
