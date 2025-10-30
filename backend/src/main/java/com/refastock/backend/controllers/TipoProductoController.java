package com.refastock.backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.refastock.backend.entities.TipoProducto;
import com.refastock.backend.services.TipoProductoService;

@RestController
@RequestMapping("/api/tipos-producto")
public class TipoProductoController {

    @Autowired
    private TipoProductoService tipoProductoService;

    @GetMapping
    public List<TipoProducto> listarTodos(){
        return tipoProductoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Optional<TipoProducto> obtenerTipoProductoPorId(@PathVariable Integer id) {
        return tipoProductoService.obtenerTipoProductoPorId(id);
    }

    @PostMapping
    public TipoProducto crear(@RequestBody TipoProducto tipoProducto) {
        return tipoProductoService.guardar(tipoProducto);
    }
}
