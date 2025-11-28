package com.refastock.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.refastock.backend.entities.EstadoProducto;
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
    
    public List<Producto> listarActivos(){
        return productoRepository.findAll().stream()
            .filter(p -> p.getEstado() == EstadoProducto.Activo)
            .toList();
    }
    
    public List<Producto> listarParaEntradas(){
        // Solo productos activos pueden recibir entradas
        return productoRepository.findAll().stream()
            .filter(p -> p.getEstado() == EstadoProducto.Activo)
            .toList();
    }
    
    public List<Producto> listarParaSalidas(){
        // Productos activos, inactivos y descontinuados con stock > 0
        return productoRepository.findAll().stream()
            .filter(p -> p.getStockActual() > 0)
            .toList();
    }

    public Optional<Producto> obtenerProductoPorId(Integer id){
        return productoRepository.findById(id);
    }

    public Producto guardarProducto(Producto producto){
        // Si el tipo de producto viene solo con nombre (desde frontend), buscar o crear
        if (producto.getTipoProducto() != null && 
            (producto.getTipoProducto().getIdTipo() == null || producto.getTipoProducto().getIdTipo() == 0) &&
            producto.getTipoProducto().getNombre() != null) {
            
            TipoProducto tipoProducto = buscarOCrearTipo(producto.getTipoProducto().getNombre());
            producto.setTipoProducto(tipoProducto);
        }
        
        // Generar SKU automáticamente si no tiene
        if (producto.getSku() == null || producto.getSku().isEmpty()) {
            producto.setSku(generarSKU(producto.getTipoProducto().getIdTipo()));
        }
        return productoRepository.save(producto);
    }
    
    private TipoProducto buscarOCrearTipo(String nombre) {
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

    private String generarSKU(Integer idTipo) {
        // Obtener el tipo de producto
        TipoProducto tipo = tipoProductoRepository.findById(idTipo).orElse(null);
        if (tipo == null) return "PRD01";
        
        // Obtener las primeras 3 letras en mayúsculas
        String nombre = tipo.getNombre().replaceAll("\\s+", ""); // Quitar espacios
        String prefijo = nombre.substring(0, Math.min(3, nombre.length())).toUpperCase();
        
        // Obtener todos los SKUs existentes con este prefijo
        List<String> skusExistentes = productoRepository.findAll().stream()
            .map(Producto::getSku)
            .filter(sku -> sku != null && sku.startsWith(prefijo))
            .toList();
        
        // Intentar generar SKU hasta encontrar uno disponible
        for (int numero = 1; numero <= 999; numero++) {
            String skuCandidato = String.format("%s%03d", prefijo, numero);
            
            if (!skusExistentes.contains(skuCandidato)) {
                return skuCandidato;
            }
        }
        
        // Si llega aquí (más de 999 productos del mismo tipo), usar timestamp
        return String.format("%s%d", prefijo, System.currentTimeMillis() % 10000);
    }

    public Producto actualizarProducto(Integer id, Producto datosActualizados) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        // Actualizar solo campos permitidos (SKU no se puede modificar)
        if (datosActualizados.getTipoProducto() != null) {
            producto.setTipoProducto(datosActualizados.getTipoProducto());
        }
        if (datosActualizados.getEstado() != null) {
            producto.setEstado(datosActualizados.getEstado());
        }
        if (datosActualizados.getVehiculoCompatible() != null) {
            producto.setVehiculoCompatible(datosActualizados.getVehiculoCompatible());
        }
        
        return productoRepository.save(producto);
    }

    public List<Producto> buscarProductos(String termino) {
        return productoRepository.findAll().stream()
            .filter(p -> p.getSku().toLowerCase().contains(termino.toLowerCase()) ||
                        (p.getTipoProducto() != null && 
                         p.getTipoProducto().getNombre().toLowerCase().contains(termino.toLowerCase())))
            .toList();
    }

    public void eliminarProducto (Integer id){
        productoRepository.deleteById(id);
    }

}
