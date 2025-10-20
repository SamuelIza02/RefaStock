package com.refastock.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.refastock.backend.entities.Producto;
import com.refastock.backend.repositories.ProductoRepository;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> listarTodos(){
        return productoRepository.findAll();
    }

    public Optional<Producto> obtenerProductoPorId(Integer id){
        return productoRepository.findById(id);
    }

    public Producto guardarProducto(Producto producto){
        return productoRepository.save(producto);
    }

    public void eliminarProducto (Integer id){
        productoRepository.deleteById(id);
    }

}
