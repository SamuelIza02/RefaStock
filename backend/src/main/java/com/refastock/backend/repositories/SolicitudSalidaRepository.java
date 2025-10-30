package com.refastock.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.refastock.backend.entities.SolicitudSalida;

@Repository
public interface SolicitudSalidaRepository extends JpaRepository<SolicitudSalida, Integer>{

}
