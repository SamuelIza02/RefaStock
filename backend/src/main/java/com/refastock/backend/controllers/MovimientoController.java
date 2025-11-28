package com.refastock.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.refastock.backend.entities.Movimiento;
import com.refastock.backend.services.MovimientoService;

@RestController
@RequestMapping("/api/movimientos")
public class MovimientoController {

    @Autowired
    private MovimientoService movimientoService;

    @GetMapping
    public List<Movimiento> listarTodosMovimientos(){
        return movimientoService.listarTodosMovimientos();
    }

    @GetMapping("/{id}") 
    public Movimiento obtenerMovimientoPorId(@PathVariable Integer id){
        return movimientoService.obtenerMovimientoPorId(id).orElse(null);
    }

    @PostMapping
    public ResponseEntity<?> guardarMovimiento(@RequestBody Movimiento movimiento){
        try {
            Movimiento movimientoGuardado = movimientoService.guardarMovimiento(movimiento);
            return ResponseEntity.ok(movimientoGuardado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/ajustes")
    public ResponseEntity<?> ajustarStock(@RequestBody AjusteStockRequest request){
        try {
            Movimiento ajuste = movimientoService.calcularAjusteStock(
                request.getIdProducto(), 
                request.getStockReal(), 
                request.getMotivo(),
                request.getIdUsuario()
            );
            return ResponseEntity.ok(ajuste);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Error: " + e.getMessage());
        }
    }

    // Clase interna para el request de ajuste
    public static class AjusteStockRequest {
        private Integer idProducto;
        private Integer stockReal;
        private String motivo;
        private Integer idUsuario;

        // Getters y setters
        public Integer getIdProducto() { return idProducto; }
        public void setIdProducto(Integer idProducto) { this.idProducto = idProducto; }
        public Integer getStockReal() { return stockReal; }
        public void setStockReal(Integer stockReal) { this.stockReal = stockReal; }
        public String getMotivo() { return motivo; }
        public void setMotivo(String motivo) { this.motivo = motivo; }
        public Integer getIdUsuario() { return idUsuario; }
        public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    }
}
