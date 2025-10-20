package com.refastock.backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.refastock.backend.entities.Rol;
import com.refastock.backend.services.RolService;

@RestController
@RequestMapping("/api/roles")
public class RolController {

    @Autowired
    private RolService rolService;

    @GetMapping
    public List<Rol> listarTodos(){
        return rolService.listarTodos();
    }
    
    @GetMapping("/{id}")
    public Optional<Rol> obtenerPorId(@PathVariable Integer id){
        return rolService.obtenerPorId(id);
    }

}
