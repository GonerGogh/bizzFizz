/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

/**
 *
 * @author flore
 */
public class Categoria {
    
    private int id_categoria;
    private String nombre_categoria;
    private Boolean activo;

    public Categoria(int id_categoria, String nombre_categoria, Boolean activo) {
        this.id_categoria = id_categoria;
        this.nombre_categoria = nombre_categoria;
        this.activo = activo;
    }
    
    public Categoria(){
        
    }

    public int getId_categoria() {
        return id_categoria;
    }

    public void setId_categoria(int id_categoria) {
        this.id_categoria = id_categoria;
    }

    public String getNombre_categoria() {
        return nombre_categoria;
    }

    public void setNombre_categoria(String nombre_categoria) {
        this.nombre_categoria = nombre_categoria;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
    
    
}
