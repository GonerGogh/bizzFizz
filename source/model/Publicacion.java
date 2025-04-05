package model;

import java.util.Date;
import java.util.List;

/**
 *
 * @author flore
 */
public class Publicacion {

    int id_publicacion;
    Negocio negocio;
    String titulo, descripcion;
    double precio;
    private List<String> imagen_publicacion;
    int reaccion;
    String ubicacion;
    Date  fecha_publicacion;
    boolean activo, destacada;

    public Publicacion(int id_publicacion, Negocio negocio, String titulo, String descripcion, double precio, List<String> imagen_publicacion, int reaccion, String ubicacion, Date fecha_publicacion, boolean activo, boolean destacada) {
        this.id_publicacion = id_publicacion;
        this.negocio = negocio;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen_publicacion = imagen_publicacion;
        this.reaccion = reaccion;
        this.ubicacion = ubicacion;
        this.fecha_publicacion = fecha_publicacion;
        this.activo = activo;
        this.destacada = destacada;
    }

    
    public Publicacion(){
        
    }

    public int getId_publicacion() {
        return id_publicacion;
    }

    public void setId_publicacion(int id_publicacion) {
        this.id_publicacion = id_publicacion;
    }

    public Negocio getNegocio() {
        return negocio;
    }

    public void setNegocio(Negocio negocio) {
        this.negocio = negocio;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public List<String> getImagen_publicacion() {
        return imagen_publicacion;
    }

    public void setImagen_publicacion(List<String> imagen_publicacion) {
        this.imagen_publicacion = imagen_publicacion;
    }

    public int getReaccion() {
        return reaccion;
    }

    public void setReaccion(int reaccion) {
        this.reaccion = reaccion;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public Date getFecha_publicacion() {
        return fecha_publicacion;
    }

    public void setFecha_publicacion(Date fecha_publicacion) {
        this.fecha_publicacion = fecha_publicacion;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public boolean isDestacada() {
        return destacada;
    }

    public void setDestacada(boolean destacada) {
        this.destacada = destacada;
    }

    
    
    
}
