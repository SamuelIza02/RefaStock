package com.refastock.backend.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.refastock.backend.entities.Movimiento;
import com.refastock.backend.repositories.MovimientoRepository;

@Service
public class MovimientoService {

    @Autowired
    private MovimientoRepository movimientoRepository;

    public List<Movimiento> listarTodosMovimientos(){
        return movimientoRepository.findAll();
    }

    public Optional<Movimiento> obtenerMovimientoPorId(Integer id){
        return movimientoRepository.findById(id);
    }

    public Movimiento guardarMovimiento(Movimiento movimiento){
        // Establecer fecha y hora actual si no viene
        if (movimiento.getFechaHora() == null) {
            movimiento.setFechaHora(LocalDateTime.now());
        }
        return movimientoRepository.save(movimiento);
    }
}
