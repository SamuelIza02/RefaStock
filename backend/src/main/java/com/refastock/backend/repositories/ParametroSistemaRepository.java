package com.refastock.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.refastock.backend.entities.ParametroSistema;

@Repository
public interface ParametroSistemaRepository extends JpaRepository<ParametroSistema, String>{

}
