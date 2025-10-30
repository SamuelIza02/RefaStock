package com.refastock.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
    public Movimiento guardarMovimiento(@RequestBody Movimiento movimiento){
        return movimientoService.guardarMovimiento(movimiento);
    }
}
