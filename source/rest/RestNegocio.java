/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package rest;

import com.google.gson.Gson;
import controller.ControllerNegocio;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import model.Negocio;

/**
 *
 * @author flore
 */
@Path("negocio")
public class RestNegocio {
    
    @GET
    @Path("getAllNegocio")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenerTodosLosNegocios() {
        ControllerNegocio cm = new ControllerNegocio();
        List<Negocio> negocios = cm.obtenerNegocio();

        if (negocios.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).entity("{\"mensaje\": \"No hay negocios registrados\"}").build();
        } else {
            Gson gson = new Gson();
            String json = gson.toJson(negocios);
            return Response.ok(json).build();
        }
    }
    
    
    private static final Gson gson = new Gson(); // Gson optimizado
    
    @POST
    @Path("agregarNegocio")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response agregarNegocio(String negocioJson) {
        ControllerNegocio cm = new ControllerNegocio();
        Negocio n = gson.fromJson(negocioJson, Negocio.class);
        
        try{
        boolean resultado = cm.agregarNegocio(n);

        if (resultado) {
            return Response.status(Response.Status.CREATED).entity("{\"mensaje\": \"Negocio registrado correctamente\"}").build();
        } else {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"mensaje\": \"Error al registrar el negocio\"}").build();
        }
        }catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"mensaje\": \"Error inesperado: " + e.getMessage() + "\"}")
                    .build();
        }
    }
    
    
    @PUT
@Path("actualizarNegocioPorNombre") // Cambia la ruta o crea una nueva
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public Response actualizarNegocioPorNombre(String negocioJson) {
    ControllerNegocio cm = new ControllerNegocio();
    Negocio negocioActualizado = gson.fromJson(negocioJson, Negocio.class);

    try {
        boolean resultado = cm.actualizarNegocioPorNombre(negocioActualizado);

        if (resultado) {
            return Response.ok("{\"mensaje\": \"Negocio actualizado correctamente\"}").build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("{\"mensaje\": \"No se encontró el negocio para actualizar con ese nombre\"}").build();
        }
    } catch (Exception e) {
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("{\"mensaje\": \"Error al actualizar el negocio: " + e.getMessage() + "\"}")
                .build();
    }
}


    @DELETE
    @Path("eliminarNegocio/{nombreNegocio}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response eliminarNegocio(@PathParam("nombreNegocio") String nombreNegocio) {
        ControllerNegocio cm = new ControllerNegocio();

        try {
            boolean resultado = cm.eliminarNegocio(nombreNegocio);

            if (resultado) {
                return Response.ok("{\"mensaje\": \"Negocio desactivado correctamente\"}").build();
            } else {
                return Response.status(Response.Status.NOT_FOUND).entity("{\"mensaje\": \"No se encontró el negocio para desactivar con ese nombre\"}").build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"mensaje\": \"Error al desactivar el negocio: " + e.getMessage() + "\"}")
                    .build();
        }
    }
    

    @GET
    @Path("getByUserName/{userName}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenerNegocioPorUserName(@PathParam("userName") String userName) {
        ControllerNegocio cm = new ControllerNegocio();
        Negocio negocio = cm.obtenerNegocioPorNombreUsuario(userName);

        if (negocio == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("{\"mensaje\": \"Negocio no encontrado\"}").build();
        } else {
            String json = gson.toJson(negocio);
            return Response.ok(json).build();
        }
    }
    
}
