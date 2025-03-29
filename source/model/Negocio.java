
package model;

/**
 *
 * @author flore
 */
public class Negocio {
 
    private int id_negocio;
    private Usuario usuario;
    private Categoria categoria;
    private String nombre_negocio, tipo_negocio, pais, estado, ciudad, codigo_postal, 
            colonia, calle, sitio_web, telefono_contacto, whatsapp, foto_perfil;

    public Negocio(int id_negocio, Usuario usuario, Categoria categoria, String nombre_negocio, String tipo_negocio, String pais, String estado, String ciudad, String codigo_postal, String colonia, String calle, String sitio_web, String telefono_contacto, String whatsapp, String foto_perfil) {
        this.id_negocio = id_negocio;
        this.usuario = usuario;
        this.categoria = categoria;
        this.nombre_negocio = nombre_negocio;
        this.tipo_negocio = tipo_negocio;
        this.pais = pais;
        this.estado = estado;
        this.ciudad = ciudad;
        this.codigo_postal = codigo_postal;
        this.colonia = colonia;
        this.calle = calle;
        this.sitio_web = sitio_web;
        this.telefono_contacto = telefono_contacto;
        this.whatsapp = whatsapp;
        this.foto_perfil = foto_perfil;
    }

    
    
    public Negocio(){
        
    }

    public int getId_negocio() {
        return id_negocio;
    }

    public void setId_negocio(int id_negocio) {
        this.id_negocio = id_negocio;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public String getNombre_negocio() {
        return nombre_negocio;
    }

    public void setNombre_negocio(String nombre_negocio) {
        this.nombre_negocio = nombre_negocio;
    }

    public String getTipo_negocio() {
        return tipo_negocio;
    }

    public void setTipo_negocio(String tipo_negocio) {
        this.tipo_negocio = tipo_negocio;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getCodigo_postal() {
        return codigo_postal;
    }

    public void setCodigo_postal(String codigo_postal) {
        this.codigo_postal = codigo_postal;
    }

    public String getColonia() {
        return colonia;
    }

    public void setColonia(String colonia) {
        this.colonia = colonia;
    }

    public String getCalle() {
        return calle;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public String getSitio_web() {
        return sitio_web;
    }

    public void setSitio_web(String sitio_web) {
        this.sitio_web = sitio_web;
    }

    public String getTelefono_contacto() {
        return telefono_contacto;
    }

    public void setTelefono_contacto(String telefono_contacto) {
        this.telefono_contacto = telefono_contacto;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public String getFoto_perfil() {
        return foto_perfil;
    }

    public void setFoto_perfil(String foto_perfil) {
        this.foto_perfil = foto_perfil;
    }

    
    
    
}
