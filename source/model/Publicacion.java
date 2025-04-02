package model;

import java.util.Date;

/**
 *
 * @author flore
 */
public class Publicacion {

    int id_publicacion;
    Negocio negocio;
    String titulo, descrpcion, ubicacion;
    double precio;
    Date  fecha_publicacion;
    boolean estatus, destacada;
    ImagenPublicacion imagen_publicacion;

    public Publicacion(int id_publicacion, Negocio negocio, String titulo, String descrpcion, String ubicacion, double precio, Date fecha_publicacion, boolean estatus, boolean destacada, ImagenPublicacion imagen_publicacion) {
        this.id_publicacion = id_publicacion;
        this.negocio = negocio;
        this.titulo = titulo;
        this.descrpcion = descrpcion;
        this.ubicacion = ubicacion;
        this.precio = precio;
        this.fecha_publicacion = fecha_publicacion;
        this.estatus = estatus;
        this.destacada = destacada;
        this.imagen_publicacion = imagen_publicacion;
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

    public String getDescrpcion() {
        return descrpcion;
    }

    public void setDescrpcion(String descrpcion) {
        this.descrpcion = descrpcion;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public Date getFecha_publicacion() {
        return fecha_publicacion;
    }

    public void setFecha_publicacion(Date fecha_publicacion) {
        this.fecha_publicacion = fecha_publicacion;
    }

    public boolean isEstatus() {
        return estatus;
    }

    public void setEstatus(boolean estatus) {
        this.estatus = estatus;
    }

    public boolean isDestacada() {
        return destacada;
    }

    public void setDestacada(boolean destacada) {
        this.destacada = destacada;
    }

    public ImagenPublicacion getImagen_publicacion() {
        return imagen_publicacion;
    }

    public void setImagen_publicacion(ImagenPublicacion imagen_publicacion) {
        this.imagen_publicacion = imagen_publicacion;
    }
    
    
    
    
}
