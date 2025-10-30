package com.refastock.backend.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.refastock.backend.entities.Usuario;
import com.refastock.backend.services.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Usuario usuario = authService.autenticar(username, password);

        if (usuario != null) {
            // Login exitoso
            Map<String, Object> response = new HashMap<>();
            response.put("user", usuario);
            response.put("token", "mock-token-" + usuario.getIdUsuario()); // Token simple por ahora
            return ResponseEntity.ok(response);
        } else {
            // Login fallido
            return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
        }
    }
}
