package com.refastock.backend.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.refastock.backend.entities.Movimiento;
import com.refastock.backend.entities.TipoMovimiento;
import com.refastock.backend.repositories.MovimientoRepository;

@Service
public class MovimientoService {

    @Autowired
    private MovimientoRepository movimientoRepository;

    @Autowired
    private ProductoService productoService;

    public List<Movimiento> listarTodosMovimientos(){
        return movimientoRepository.findAll();
    }

    public Optional<Movimiento> obtenerMovimientoPorId(Integer id){
        return movimientoRepository.findById(id);
    }

    public boolean validarStockDisponible(Integer idProducto, Integer cantidad) {
        var producto = productoService.obtenerProductoPorId(idProducto);
        if (producto.isPresent()) {
            return producto.get().getStockActual() >= cantidad;
        }
        return false;
    }

    public Movimiento calcularAjusteStock(Integer idProducto, Integer stockReal, String motivo, Integer idUsuario) {
        var producto = productoService.obtenerProductoPorId(idProducto)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        int stockActual = producto.getStockActual();
        int diferencia = stockReal - stockActual;
        
        if (diferencia == 0) {
            throw new RuntimeException("No hay diferencia entre stock real y stock del sistema");
        }
        
        Movimiento ajuste = new Movimiento();
        ajuste.setProducto(producto);
        ajuste.setCantidad(Math.abs(diferencia));
        ajuste.setTipoMovimiento(diferencia > 0 ? TipoMovimiento.Ajuste_Positivo : TipoMovimiento.Ajuste_Negativo);
        ajuste.setMotivo(motivo + " - Diferencia: " + diferencia);
        ajuste.setFechaHora(LocalDateTime.now());
        
        // Buscar usuario
        var usuario = new com.refastock.backend.entities.Usuario();
        usuario.setIdUsuario(idUsuario);
        ajuste.setUsuario(usuario);
        
        return movimientoRepository.save(ajuste);
    }

    public Movimiento guardarMovimiento(Movimiento movimiento){
        // Validar stock suficiente para salidas
        if (movimiento.getTipoMovimiento() == TipoMovimiento.Salida) {
            if (!validarStockDisponible(movimiento.getProducto().getIdProducto(), movimiento.getCantidad())) {
                throw new RuntimeException("Stock insuficiente. Stock disponible: " + 
                    movimiento.getProducto().getStockActual());
            }
        }
        
        // Establecer fecha y hora actual si no viene
        if (movimiento.getFechaHora() == null) {
            movimiento.setFechaHora(LocalDateTime.now());
        }
        return movimientoRepository.save(movimiento);
    }
}
