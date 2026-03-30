package com.photographer.controller;

import com.photographer.model.AuthResponse;
import com.photographer.model.LoginRequest;
import com.photographer.model.RegisterRequest;
import com.photographer.service.AdminAccessService;
import com.photographer.service.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AdminAccessService adminAccessService;

    public AuthController(AuthService authService, AdminAccessService adminAccessService) {
        this.authService = authService;
        this.adminAccessService = adminAccessService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email ou mot de passe incorrect."));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(Map.of(
                "email", email,
                "isAdmin", adminAccessService.isAdminEmail(email)
        ));
    }
}
