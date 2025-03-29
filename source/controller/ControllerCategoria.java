
package controller;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import db.ConexionMongoDB;
import java.util.ArrayList;
import java.util.List;
import model.Categoria;
import org.bson.conversions.Bson;

/**
 *
 * @author flore
 */
public class ControllerCategoria {
    
        // Método para obtener todos los productos de maquillaje
    public List<Categoria> obtenerCategoria() {
        ConexionMongoDB conexion = new ConexionMongoDB();
        MongoDatabase database = conexion.open();
        MongoCollection<Categoria> collection = database.getCollection("categoria", Categoria.class);

        List<Categoria> listaCategorias = new ArrayList<>();
        collection.find().into(listaCategorias);

        conexion.close();
        return listaCategorias;
    }
    
    // Método para obtener una categoría por su nombre
    public Categoria obtenerCategoriaPorNombre(String nombre_categoria) {
        ConexionMongoDB conexion = new ConexionMongoDB();
        MongoDatabase database = conexion.open();
        MongoCollection<Categoria> collection = database.getCollection("categoria", Categoria.class);

        Bson filtro = Filters.eq("nombre_categoria", nombre_categoria);
        Categoria categoria = collection.find(filtro).first();

        conexion.close();
        return categoria;
    }
}
