package com.refastock.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.refastock.backend.entities.Producto;
import com.refastock.backend.entities.TipoProducto;
import com.refastock.backend.repositories.ProductoRepository;
import com.refastock.backend.repositories.TipoProductoRepository;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private TipoProductoRepository tipoProductoRepository;

    public List<Producto> listarTodos(){
        return productoRepository.findAll();
    }

    public Optional<Producto> obtenerProductoPorId(Integer id){
        return productoRepository.findById(id);
    }

    public Producto guardarProducto(Producto producto){
        // Generar SKU automáticamente si no tiene
        if (producto.getSku() == null || producto.getSku().isEmpty()) {
            producto.setSku(generarSKU(producto.getTipoProducto().getIdTipo()));
        }
        return productoRepository.save(producto);
    }

    private String generarSKU(Integer idTipo) {
        // Obtener el tipo de producto
        TipoProducto tipo = tipoProductoRepository.findById(idTipo).orElse(null);
        if (tipo == null) return "PRD01";
        
        // Obtener las primeras 3 letras en mayúsculas
        String nombre = tipo.getNombre().replaceAll("\\s+", ""); // Quitar espacios
        String prefijo = nombre.substring(0, Math.min(3, nombre.length())).toUpperCase();
        
        // Intentar generar SKU hasta encontrar uno disponible
        for (int numero = 1; numero < 100; numero++) {
            String skuCandidato = String.format("%s%02d", prefijo, numero);
            
            // Verificar si ya existe este SKU
            boolean existe = productoRepository.findAll().stream()
                .anyMatch(p -> p.getSku() != null && p.getSku().equals(skuCandidato));
            
            if (!existe) {
                return skuCandidato;
            }
        }
        
        // Si llega aquí (más de 99 productos del mismo tipo), usar timestamp
        return String.format("%s%02d", prefijo, 99);
    }

    public void eliminarProducto (Integer id){
        productoRepository.deleteById(id);
    }

}
