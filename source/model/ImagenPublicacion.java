package model;

/**
 *
 * @author flore
 */
public class ImagenPublicacion {

    private int id_imagen, orden;
    private String url_imagen;
    private Boolean es_principal;

    public ImagenPublicacion(int id_imagen, int orden, String url_imagen, Boolean es_principal) {
        this.id_imagen = id_imagen;
        this.orden = orden;
        this.url_imagen = url_imagen;
        this.es_principal = es_principal;
    }
  
    public ImagenPublicacion(){
        
    }

    public int getId_imagen() {
        return id_imagen;
    }

    public void setId_imagen(int id_imagen) {
        this.id_imagen = id_imagen;
    }

    public int getOrden() {
        return orden;
    }

    public void setOrden(int orden) {
        this.orden = orden;
    }

    public String getUrl_imagen() {
        return url_imagen;
    }

    public void setUrl_imagen(String url_imagen) {
        this.url_imagen = url_imagen;
    }

    public Boolean getEs_principal() {
        return es_principal;
    }

    public void setEs_principal(Boolean es_principal) {
        this.es_principal = es_principal;
    }
    
    
}
