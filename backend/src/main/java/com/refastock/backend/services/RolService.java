package com.refastock.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.refastock.backend.entities.Rol;
import com.refastock.backend.repositories.RolRepository;

@Service
public class RolService {

    @Autowired
    private RolRepository rolRepository;

    public List<Rol> listarTodos(){
        return rolRepository.findAll();
    }

    public Optional<Rol> obtenerPorId(Integer id){
        return rolRepository.findById(id);
    }
}
