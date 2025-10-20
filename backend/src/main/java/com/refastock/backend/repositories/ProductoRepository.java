package com.refastock.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.refastock.backend.entities.Producto;


@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer>{

}
