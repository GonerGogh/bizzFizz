package rest;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import controller.ControllerCliente;
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
import model.Cliente;
import model.Negocio;

/**
 *
 * @author flore
 */
@Path("cliente")
public class RestCliente {

    @GET
    @Path("getAllCliente")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenerTodosLosClientes() {
        ControllerCliente cm = new ControllerCliente();
        List<Cliente> clientes = cm.obtenerCliente();

        if (clientes.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).entity("{\"mensaje\": \"No hay clientes registrados\"}").build();
        } else {
            Gson gson = new Gson();
            String json = gson.toJson(clientes);
            return Response.ok(json).build();
        }
    }

    private static final Gson gson = new Gson(); // Gson optimizado

    @POST
    @Path("agregarCliente")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response agregarCliente(String clienteJson) {
        ControllerCliente cm = new ControllerCliente();
        Cliente c = gson.fromJson(clienteJson, Cliente.class);
        
        try{
        boolean resultado = cm.agregarCliente(c);

        if (resultado) {
            return Response.status(Response.Status.CREATED).entity("{\"mensaje\": \"Cliente registrado correctamente\"}").build();
        } else {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"mensaje\": \"Error al registrar el cliente\"}").build();
        }
        }catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"mensaje\": \"Error inesperado: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    
    @GET
    @Path("getByUserName/{userName}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenerClientePorUserName(@PathParam("userName") String userName) {
        ControllerCliente cm = new ControllerCliente();
        Cliente cliente = cm.obtenerClientePorNombreUsuario(userName);

        if (cliente == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("{\"mensaje\": \"Cliente no encontrado\"}").build();
        } else {
            String json = gson.toJson(cliente);
            return Response.ok(json).build();
        }
    }
    
   @PUT
@Path("updateProfileImage/{userName}")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public Response actualizarFotoPerfil(@PathParam("userName") String userName, String nuevaFotoJson) {
    ControllerCliente cm = new ControllerCliente();

    try {
        // Recibe el JSON y deserializa a un objeto (puedes crear una clase simple para esto)
        // o extraer el valor directamente del String JSON
        JsonObject jsonObject = gson.fromJson(nuevaFotoJson, JsonObject.class);
        String nuevaFotoPerfilBase64 = jsonObject.get("fotoPerfilBase64").getAsString();

        boolean resultado = cm.actualizarFotoPerfilCliente(userName, nuevaFotoPerfilBase64);

        if (resultado) {
            return Response.ok("{\"mensaje\": \"Foto de perfil actualizada correctamente\"}").build();
        } else {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"mensaje\": \"Error al actualizar la foto de perfil\"}").build();
        }
    } catch (Exception e) {
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("{\"mensaje\": \"Error inesperado: " + e.getMessage() + "\"}")
                .build();
    }
}

    @DELETE
    @Path("eliminarCliente/{nombreCliente}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response eliminarCliente(@PathParam("nombreCliente") String nombreCliente) {
        ControllerCliente cm = new ControllerCliente();

        try {
            boolean resultado = cm.eliminarCliente(nombreCliente);

            if (resultado) {
                return Response.ok("{\"mensaje\": \"Cliente desactivado correctamente\"}").build();
            } else {
                return Response.status(Response.Status.NOT_FOUND).entity("{\"mensaje\": \"No se encontró el cliente para desactivar con ese nombre\"}").build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"mensaje\": \"Error al desactivar el cliente: " + e.getMessage() + "\"}")
                    .build();
        }
    }
  
    
    /*@GET
    @Path("getCliente/{idCliente}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenerClientePorId(@PathParam("idCliente") int idCliente) {
        ControllerCliente cm = new ControllerCliente();
        Cliente cliente = cm.obtenerClientePorId(idCliente); // Debes crear este método en ControllerCliente

        if (cliente == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("{\"mensaje\": \"Cliente no encontrado\"}").build();
        } else {
            Gson gson = new Gson();
            String json = gson.toJson(cliente);
            return Response.ok(json).build();
        }
    }

    @PUT
    @Path("actualizarCliente/{idCliente}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response actualizarCliente(@PathParam("idCliente") int idCliente, Cliente cliente) {
        ControllerCliente cm = new ControllerCliente();
        cliente.setId_cliente(idCliente); // Asegurar que el ID del cliente sea el mismo que en la URL
        boolean resultado = cm.actualizarCliente(cliente); // Debes crear este método en ControllerCliente

        if (resultado) {
            return Response.ok("{\"mensaje\": \"Cliente actualizado correctamente\"}").build();
        } else {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"mensaje\": \"Error al actualizar el cliente\"}").build();
        }
    }

    @DELETE
    @Path("eliminarCliente/{idCliente}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response eliminarCliente(@PathParam("idCliente") int idCliente) {
        ControllerCliente cm = new ControllerCliente();
        boolean resultado = cm.eliminarCliente(idCliente); // Debes crear este método en ControllerCliente

        if (resultado) {
            return Response.ok("{\"mensaje\": \"Cliente eliminado correctamente\"}").build();
        } else {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"mensaje\": \"Error al eliminar el cliente\"}").build();
        }
    }
    
    */
}
