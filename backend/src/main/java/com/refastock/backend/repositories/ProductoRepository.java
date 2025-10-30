package com.refastock.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.refastock.backend.entities.Producto;



import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer>{
    long countByTipoProducto_IdTipo(Integer idTipo);
    Producto findFirstByTipoProducto_IdTipoOrderByIdProductoDesc(Integer idTipo);
    
    @Query("SELECT p FROM Producto p WHERE p.tipoProducto.idTipo = :idTipo AND p.sku LIKE CONCAT(:prefijo, '%') ORDER BY p.sku DESC")
    Producto findUltimoProductoPorPrefijo(@Param("idTipo") Integer idTipo, @Param("prefijo") String prefijo);
}
