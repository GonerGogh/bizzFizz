package rest;

import com.google.gson.Gson;
import controller.ControllerUsuario;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import model.Usuario;
import org.json.JSONObject;

/**
 *
 * @author flore
 */
@Path("usuario")
public class RestUsuario {

    @GET
    @Path("getAllUsuario")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenerTodosLosUsuarios() {
        ControllerUsuario cm = new ControllerUsuario();
        List<Usuario> usuarios = cm.obtenerUsuario();

        if (usuarios.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).entity("{\"mensaje\": \"No hay usuarios registrados\"}").build();
        } else {
            Gson gson = new Gson();
            String json = gson.toJson(usuarios);
            return Response.ok(json).build();
        }
    }

    @POST
    @Path("login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(String jsonString) {
        try {
            JSONObject json = new JSONObject(jsonString);
            String email = json.getString("email");
            String password = json.getString("password");

            ControllerUsuario cu = new ControllerUsuario();
            Usuario usuario = cu.login(email, password);

            if (usuario == null) {
                return Response.status(Response.Status.UNAUTHORIZED).entity(new JSONObject().put("mensaje", "Credenciales incorrectas.").toString()).build();
            } else if (!usuario.isActivo()) {
                return Response.status(Response.Status.FORBIDDEN).entity(new JSONObject().put("mensaje", "Cuenta inactiva. Contacte al administrador.").toString()).build();
            } else {
                // Incluir el nombre del usuario en la respuesta
                JSONObject responseJson = new JSONObject();
                responseJson.put("tipo_usuario", usuario.getTipo_usuario());
                responseJson.put("nombre", usuario.getNombre_usuario());
                responseJson.put("email", usuario.getCorreo_electronico());
                responseJson.put("activo", usuario.isActivo()); //Include active state for debugging.

                return Response.ok(responseJson.toString()).build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(new JSONObject().put("mensaje", "Error interno del servidor.").toString()).build();
        }
    }
}