package com.refastock.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.refastock.backend.entities.SolicitudSalida;
import com.refastock.backend.repositories.SolicitudSalidaRepository;

@Service
public class SolicitudSalidaService {

    @Autowired
    private SolicitudSalidaRepository solicitudSalidaRepository;

    public List<SolicitudSalida> listarTodasSolicitudes(){
        return solicitudSalidaRepository.findAll();
    }

    public Optional<SolicitudSalida> obtenerSolicitudSalidaPorId(Integer id){
        return solicitudSalidaRepository.findById(id);
    }
    
    public SolicitudSalida guardarSolicitudSalida(SolicitudSalida solicitudSalida){
        return solicitudSalidaRepository.save(solicitudSalida);
    }
}
