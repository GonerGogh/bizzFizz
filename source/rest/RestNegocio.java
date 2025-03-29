/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package rest;

import com.google.gson.Gson;
import controller.ControllerNegocio;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
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
    
}
