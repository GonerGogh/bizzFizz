package controller;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import db.ConexionMongoDB;
import java.util.ArrayList;
import java.util.List;
import model.Usuario;
import org.bson.conversions.Bson;

/**
 * @author flore
 */
public class ControllerUsuario {

    public List<Usuario> obtenerUsuario() {
        ConexionMongoDB conexion = new ConexionMongoDB();
        MongoDatabase database = conexion.open();
        MongoCollection<Usuario> collection = database.getCollection("usuario", Usuario.class);

        List<Usuario> listaUsuarios = new ArrayList<>();
        collection.find().into(listaUsuarios);

        conexion.close();
        return listaUsuarios;
    }

    public Usuario login(String email, String password) {
        ConexionMongoDB conexion = new ConexionMongoDB();
        MongoDatabase database = conexion.open();
        MongoCollection<Usuario> collection = database.getCollection("usuario", Usuario.class);

        Bson filtro = Filters.and(
            Filters.eq("correo_electronico", email),
            Filters.eq("contrasenia", password)
        );

        Usuario usuario = collection.find(filtro).first();

        conexion.close();
        return usuario;
    }
}