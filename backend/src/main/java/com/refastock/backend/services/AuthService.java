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
        // Buscar usuario por username
        Usuario usuario = usuarioRepository.findByUsername(username).orElse(null);

        if (usuario == null) {
            return null; // Usuario no existe
        }

        // Verificar contraseña (por ahora comparación simple, luego BCrypt)
        if (usuario.getPassHash().equals(password)) {
            return usuario;
        }

        return null; // Contraseña incorrecta
    }
}
