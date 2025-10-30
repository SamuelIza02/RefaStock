package com.refastock.backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.refastock.backend.entities.SolicitudSalida;
import com.refastock.backend.services.SolicitudSalidaService;

@RestController
@RequestMapping("/api/solicitudes-salida")
public class SolicitudSalidaController {

    @Autowired
    private SolicitudSalidaService solicitudSalidaService;

    @GetMapping
    public List<SolicitudSalida> listarTodas(){
        return solicitudSalidaService.listarTodasSolicitudes();
    }

    @GetMapping("/{id}")
    public Optional<SolicitudSalida> obtenerPorId(@PathVariable Integer id){
        return solicitudSalidaService.obtenerSolicitudSalidaPorId(id);
    }

    @PostMapping
    public SolicitudSalida crear(@RequestBody SolicitudSalida solicitud){
        return solicitudSalidaService.guardarSolicitudSalida(solicitud);
    }

    @PutMapping("/{id}")
    public SolicitudSalida actualizar(@PathVariable Integer id, @RequestBody SolicitudSalida solicitud){
        solicitud.setIdSolicitud(id);
        return solicitudSalidaService.guardarSolicitudSalida(solicitud);
    }
}
