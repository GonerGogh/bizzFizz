
package model;

/**
 *
 * @author flore
 */
public class Cliente {
    
    private int id_cliente;
    private Usuario usuario;
    private String nombre_cliente, apellido_paterno, apellido_materno, telefono, foto_perfil;

    public Cliente(int id_cliente, Usuario usuario, String nombre_cliente, String apellido_paterno, String apellido_materno, String telefono, String foto_perfil) {
        this.id_cliente = id_cliente;
        this.usuario = usuario;
        this.nombre_cliente = nombre_cliente;
        this.apellido_paterno = apellido_paterno;
        this.apellido_materno = apellido_materno;
        this.telefono = telefono;
        this.foto_perfil = foto_perfil;
    }

    

   
    
    public Cliente(){
        
    }

    public int getId_cliente() {
        return id_cliente;
    }

    public void setId_cliente(int id_cliente) {
        this.id_cliente = id_cliente;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getNombre_cliente() {
        return nombre_cliente;
    }

    public void setNombre_cliente(String nombre_cliente) {
        this.nombre_cliente = nombre_cliente;
    }

    public String getApellido_paterno() {
        return apellido_paterno;
    }

    public void setApellido_paterno(String apellido_paterno) {
        this.apellido_paterno = apellido_paterno;
    }

    public String getApellido_materno() {
        return apellido_materno;
    }

    public void setApellido_materno(String apellido_materno) {
        this.apellido_materno = apellido_materno;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getFoto_perfil() {
        return foto_perfil;
    }

    public void setFoto_perfil(String foto_perfil) {
        this.foto_perfil = foto_perfil;
    }

    
    
    
    
    
    
}