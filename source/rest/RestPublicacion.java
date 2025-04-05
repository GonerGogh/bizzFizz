/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package rest;

import com.google.gson.Gson;
import controller.ControllerPublicacion;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import model.Publicacion;

/**
 *
 * @author flore
 */
@Path("publicacion")
public class RestPublicacion {
    
   @GET
    @Path("getAllPublicacion")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenerTodosLasPublicaciones() {
        ControllerPublicacion cm = new ControllerPublicacion();
        List<Publicacion> publicaciones = cm.obtenerPublicacion();

        if (publicaciones.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).entity("{\"mensaje\": \"No hay publicaciones registrados\"}").build();
        } else {
            Gson gson = new Gson();
            String json = gson.toJson(publicaciones);
            return Response.ok(json).build();
        }
    }
    
    
    private static final Gson gson = new Gson(); // Gson optimizado

    @POST
    @Path("agregarPublicacion")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response agregarPublicacion(String publicacionJson) {
        ControllerPublicacion cm = new ControllerPublicacion();
        Publicacion p = gson.fromJson(publicacionJson, Publicacion.class);
        
        try{
        boolean resultado = cm.agregarPublicacion(p);

        if (resultado) {
            return Response.status(Response.Status.CREATED).entity("{\"mensaje\": \"Publicacion registrada correctamente\"}").build();
        } else {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"mensaje\": \"Error al registrar la publicacion\"}").build();
        }
        }catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"mensaje\": \"Error inesperado: " + e.getMessage() + "\"}")
                    .build();
        }
    }
    
    
    
    @POST
    @Path("actualizarPublicacion")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response actualizarPublicacion(String publicacionJson) {
        ControllerPublicacion cm = new ControllerPublicacion();
        Publicacion p = gson.fromJson(publicacionJson, Publicacion.class);

        try {
            boolean resultado = cm.actualizarPublicacion(p);

            if (resultado) {
                return Response.status(Response.Status.OK).entity("{\"mensaje\": \"Publicación actualizada correctamente\"}").build();
            } else {
                return Response.status(Response.Status.NOT_FOUND).entity("{\"mensaje\": \"No se encontró la publicación o no se pudo actualizar\"}").build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"mensaje\": \"Error inesperado: " + e.getMessage() + "\"}")
                    .build();
        }
    }
}
