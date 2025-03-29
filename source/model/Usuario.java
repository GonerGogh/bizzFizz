package model;

import java.util.Date;

/**
 *
 * @author flore
 */
public class Usuario {
    
    private int id_usuario;
    private String nombre_usuario, correo_electronico, contrasenia, tipo_usuario;
    private Date fecha_registro;
    private boolean activo;

    public Usuario(int id_usuario, String nombre_usuario, String correo_electronico, String contrasenia, String tipo_usuario, Date fecha_registro, boolean activo) {
        this.id_usuario = id_usuario;
        this.nombre_usuario = nombre_usuario;
        this.correo_electronico = correo_electronico;
        this.contrasenia = contrasenia;
        this.tipo_usuario = tipo_usuario;
        this.fecha_registro = fecha_registro;
        this.activo = activo;
    }
    
    public Usuario(){
        
    }

    public int getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(int id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getNombre_usuario() {
        return nombre_usuario;
    }

    public void setNombre_usuario(String nombre_usuario) {
        this.nombre_usuario = nombre_usuario;
    }

    public String getCorreo_electronico() {
        return correo_electronico;
    }

    public void setCorreo_electronico(String correo_electronico) {
        this.correo_electronico = correo_electronico;
    }

    public String getContrasenia() {
        return contrasenia;
    }

    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
    }

    public String getTipo_usuario() {
        return tipo_usuario;
    }

    public void setTipo_usuario(String tipo_usuario) {
        this.tipo_usuario = tipo_usuario;
    }

    public Date getFecha_registro() {
        return fecha_registro;
    }

    public void setFecha_registro(Date fecha_registro) {
        this.fecha_registro = fecha_registro;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
    
    
    
}
