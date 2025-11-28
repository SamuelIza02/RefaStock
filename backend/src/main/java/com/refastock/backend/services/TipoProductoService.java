package com.refastock.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.refastock.backend.entities.TipoProducto;
import com.refastock.backend.repositories.TipoProductoRepository;

@Service
public class TipoProductoService {

    @Autowired
    private TipoProductoRepository tipoProductoRepository;

    public List<TipoProducto> listarTodos(){
        return tipoProductoRepository.findAll();
    }

    public Optional<TipoProducto> obtenerTipoProductoPorId(Integer id){
        return tipoProductoRepository.findById(id);
    }

    public TipoProducto guardar(TipoProducto tipoProducto){
        // Normalizar nombre: trim y capitalizar primera letra
        String nombreNormalizado = normalizarNombre(tipoProducto.getNombre());
        
        // Verificar si ya existe un tipo con ese nombre
        if (existeTipoProducto(nombreNormalizado)) {
            throw new RuntimeException("Ya existe un tipo de producto con el nombre: " + nombreNormalizado);
        }
        
        tipoProducto.setNombre(nombreNormalizado);
        return tipoProductoRepository.save(tipoProducto);
    }
    
    public TipoProducto buscarOCrear(String nombre) {
        String nombreNormalizado = normalizarNombre(nombre);
        
        // Buscar si ya existe
        Optional<TipoProducto> tipoExistente = tipoProductoRepository.findAll().stream()
            .filter(tipo -> tipo.getNombre().equalsIgnoreCase(nombreNormalizado))
            .findFirst();
            
        if (tipoExistente.isPresent()) {
            return tipoExistente.get();
        }
        
        // Si no existe, crear nuevo
        TipoProducto nuevoTipo = new TipoProducto();
        nuevoTipo.setNombre(nombreNormalizado);
        return tipoProductoRepository.save(nuevoTipo);
    }
    
    private String normalizarNombre(String nombre) {
        if (nombre == null) return null;
        
        // Trim y capitalizar primera letra de cada palabra
        String[] palabras = nombre.trim().toLowerCase().split("\\s+");
        StringBuilder resultado = new StringBuilder();
        
        for (String palabra : palabras) {
            if (!palabra.isEmpty()) {
                if (resultado.length() > 0) resultado.append(" ");
                resultado.append(palabra.substring(0, 1).toUpperCase())
                         .append(palabra.substring(1));
            }
        }
        
        return resultado.toString();
    }
    
    private boolean existeTipoProducto(String nombre) {
        return tipoProductoRepository.findAll().stream()
            .anyMatch(tipo -> tipo.getNombre().equalsIgnoreCase(nombre.trim()));
    }
    
    public Optional<TipoProducto> buscarPorNombre(String nombre) {
        String nombreNormalizado = normalizarNombre(nombre);
        return tipoProductoRepository.findAll().stream()
            .filter(tipo -> tipo.getNombre().equalsIgnoreCase(nombreNormalizado))
            .findFirst();
    }
    
    public TipoProducto actualizar(Integer id, TipoProducto tipoProducto) {
        TipoProducto tipoExistente = tipoProductoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tipo de producto no encontrado"));
            
        String nombreNormalizado = normalizarNombre(tipoProducto.getNombre());
        
        // Verificar que no exista otro tipo con el mismo nombre
        boolean existeOtro = tipoProductoRepository.findAll().stream()
            .anyMatch(tipo -> !tipo.getIdTipo().equals(id) && 
                     tipo.getNombre().equalsIgnoreCase(nombreNormalizado));
                     
        if (existeOtro) {
            throw new RuntimeException("Ya existe otro tipo de producto con el nombre: " + nombreNormalizado);
        }
        
        tipoExistente.setNombre(nombreNormalizado);
        return tipoProductoRepository.save(tipoExistente);
    }
}
