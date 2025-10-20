package com.refastock.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.refastock.backend.entities.TipoProducto;
import com.refastock.backend.repositories.TipoProductoRepository;

@Service
public class TipoProductoService {

    @Autowired
    private TipoProductoRepository tipoProductoRepository;

    public List<TipoProducto> listarTodos(){
        return tipoProductoRepository.findAll();
    }

    public Optional<TipoProducto> obtenerTipoProductoPorId(Integer id){
        return tipoProductoRepository.findById(id);
    }
}
