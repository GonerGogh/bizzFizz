
package controller;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import com.mongodb.client.result.InsertOneResult;
import com.mongodb.client.result.UpdateResult;
import db.ConexionMongoDB;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import model.Categoria;
import model.Usuario;
import model.Negocio;
import model.Publicacion;
import org.bson.Document;
import org.bson.conversions.Bson;

/**
 *
 * @author flore
 */
public class ControllerPublicacion {
    
    public boolean agregarPublicacion(Publicacion publicacion) {

        ConexionMongoDB conexion = new ConexionMongoDB();
        MongoDatabase database = conexion.open();
        MongoCollection<Document> collectionNegocio = database.getCollection("negocio");
        MongoCollection<Document> collectionUsuario = database.getCollection("usuario");
        MongoCollection<Document> collectionPublicacion = database.getCollection("publicacion");

        // 1. Obtener el último ID y generar los nuevos IDs
        int idPublicacion = obtenerUltimoId(collectionPublicacion) + 1;

        // Obtener los datos
        Negocio negocio = obtenerNegocioDesdeDB(publicacion.getNegocio().getNombre_negocio(), database);
        if (negocio == null) {
            conexion.close();
            throw new IllegalArgumentException("El negocio no existe en la base de datos");
        }

        StringBuilder ubicacionBuilder = new StringBuilder();

        if (negocio.getColonia() != null && !negocio.getColonia().isEmpty()) {
            ubicacionBuilder.append(negocio.getColonia());
        }
        if (negocio.getCalle() != null && !negocio.getCalle().isEmpty()) {
            if (ubicacionBuilder.length() > 0) {
                ubicacionBuilder.append(", ");
            }
            ubicacionBuilder.append(negocio.getCalle());
        }
        if (negocio.getCiudad() != null && !negocio.getCiudad().isEmpty()) {
            if (ubicacionBuilder.length() > 0) {
                ubicacionBuilder.append(", ");
            }
            ubicacionBuilder.append(negocio.getCiudad());
        }
        if (negocio.getEstado() != null && !negocio.getEstado().isEmpty()) {
            if (ubicacionBuilder.length() > 0) {
                ubicacionBuilder.append(", ");
            }
            ubicacionBuilder.append(negocio.getEstado());
        }

        String ubicacion = ubicacionBuilder.toString();

        // 5. Crear el documento para el
        Document documentoPublicacion = new Document()
                .append("id_publicacion", idPublicacion)
                .append("negocio", new Document()
                        .append("id_negocio", negocio.getId_negocio())
                        .append("usuario", new Document()
                                .append("id_usuario", negocio.getUsuario().getId_usuario())
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
                        .append("foto_perfil", negocio.getFoto_perfil())
                )
                .append("titulo", publicacion.getTitulo())
                .append("descripcion", publicacion.getDescripcion())
                .append("precio", publicacion.getPrecio())
                .append("imagen_publicacion", publicacion.getImagen_publicacion())
                .append("reaccion", publicacion.getReaccion())
                .append("ubicacion", ubicacion)
                .append("fecha_publicacion", new Date())
                .append("activo", true)
                .append("destacada", true);

        // 6. Insertar el documento del cliente
        InsertOneResult resultPublicacion = collectionPublicacion.insertOne(documentoPublicacion);
        boolean resultadoPublicacion = resultPublicacion.getInsertedId() != null;

        conexion.close();
        return resultadoPublicacion; // Devuelve true si ambos registros fueron exitosos
    }
    
    
    
    
    
    private Negocio obtenerNegocioDesdeDB(String nombre_negocio, MongoDatabase database) {
    System.out.println("Buscando negocio en la BD: " + nombre_negocio); // Debugging
    MongoCollection<Negocio> negocioCollection = database.getCollection("negocio", Negocio.class);
    Bson filtro = Filters.eq("nombre_negocio", nombre_negocio); 
    Negocio negocio = negocioCollection.find(filtro).first(); 

    if (negocio == null) {
        System.out.println("No se encontró el negocio: " + nombre_negocio); // Verifica si el problema está aquí
    }
    
    return negocio;
}
    
    
    // Método auxiliar para obtener el último ID insertado en una colección
private int obtenerUltimoId(MongoCollection<Document> collection) {
    Document ultimoDocumento = collection.find().sort(new Document("_id", -1)).first();
    if (ultimoDocumento != null && ultimoDocumento.containsKey("id_publicacion")) {
        return ultimoDocumento.getInteger("id_publicacion");
    } else if (ultimoDocumento != null && ultimoDocumento.containsKey("id_negocio")) {
        return ultimoDocumento.getInteger("id_negocio");
    } else {
        return 0; // Si no hay documentos, el ID inicial es 0
    }
}
    
    



    public boolean actualizarPublicacion(Publicacion publicacion) {
        ConexionMongoDB conexion = new ConexionMongoDB();
        MongoDatabase database = conexion.open();
        MongoCollection<Document> collectionPublicacion = database.getCollection("publicacion");

        // Crear el filtro para encontrar la publicación por su ID
        Bson filtro = Filters.eq("id_publicacion", publicacion.getId_publicacion());

        // Crear las actualizaciones para los campos que se pueden modificar
        Bson actualizaciones = Updates.combine(
            Updates.set("titulo", publicacion.getTitulo()),
            Updates.set("descripcion", publicacion.getDescripcion()),
            Updates.set("precio", publicacion.getPrecio()),
            Updates.set("imagen_publicacion", publicacion.getImagen_publicacion()),
            Updates.set("activo", publicacion.isActivo()),
            Updates.set("fecha_actualizacion", new Date()) // Opcional: registrar la fecha de actualización
        );

        // Realizar la actualización
        UpdateResult resultado = collectionPublicacion.updateOne(filtro, actualizaciones);

        conexion.close();
        return resultado.getModifiedCount() > 0; // Devuelve true si se modificó al menos un documento
    }
    
    
    
    public List<Publicacion> obtenerPublicacion() {
        ConexionMongoDB conexion = new ConexionMongoDB();
        MongoDatabase database = conexion.open();
        MongoCollection<Publicacion> collection = database.getCollection("publicacion", Publicacion.class);

        List<Publicacion> listaPublicaciones = new ArrayList<>();
        collection.find().into(listaPublicaciones);

        conexion.close();
        return listaPublicaciones;
    }
    
}
