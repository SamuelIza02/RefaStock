package com.refastock.backend.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.refastock.backend.entities.ParametroSistema;
import com.refastock.backend.repositories.ParametroSistemaRepository;

@Service
public class ParametroSistemaService {

    @Autowired
    private ParametroSistemaRepository parametroSistemaRepository;

    public Optional<ParametroSistema> obtenerPorClave(String clave){
        return parametroSistemaRepository.findById(clave);
    }

    public String obtenerValor(String clave){
        return parametroSistemaRepository.findById(clave)
            .map(ParametroSistema::getValor)
            .orElse(null);
    }
}
