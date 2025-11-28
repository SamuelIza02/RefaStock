package com.refastock.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.refastock.backend.entities.Usuario;
import com.refastock.backend.repositories.UsuarioRepository;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario autenticar(String username, String password) {
        try {
            // Buscar usuario por username
            Usuario usuario = usuarioRepository.findByUsername(username).orElse(null);

            if (usuario == null || !usuario.isActivo()) {
                return null; // Usuario no existe o está inactivo
            }

            // Por ahora comparación simple - en producción usar BCrypt
            // TODO: Implementar BCrypt para hash de contraseñas
            if (usuario.getPassHash().equals(password)) {
                return usuario;
            }

            return null; // Contraseña incorrecta
        } catch (Exception e) {
            return null; // Error en autenticación
        }
    }
}
