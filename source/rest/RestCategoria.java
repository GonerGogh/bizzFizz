/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package rest;

import com.google.gson.Gson;
import controller.ControllerCategoria;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import model.Categoria;

/**
 *
 * @author flore
 */
@Path("categoria")
public class RestCategoria {
    
    @GET
    @Path("getAllCategoria")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenerTodosLasCategorias() {
        ControllerCategoria cm = new ControllerCategoria();
        List<Categoria> categorias = cm.obtenerCategoria();

        if (categorias.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).entity("{\"mensaje\": \"No hay categorias registrados\"}").build();
        } else {
            Gson gson = new Gson();
            String json = gson.toJson(categorias);
            return Response.ok(json).build();
        }
    }
    
    
    @GET
    @Path("getCategoriaByName/{nombre_categoria}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenerCategoriaPorNombre(@PathParam("nombre_categoria") String nombre_categoria) {
        ControllerCategoria cm = new ControllerCategoria();
        Categoria categoria = cm.obtenerCategoriaPorNombre(nombre_categoria);

        if (categoria == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("{\"mensaje\": \"Categoría no encontrada\"}").build();
        } else {
            Gson gson = new Gson();
            String json = gson.toJson(categoria);
            return Response.ok(json).build();
        }
    }
    
}
