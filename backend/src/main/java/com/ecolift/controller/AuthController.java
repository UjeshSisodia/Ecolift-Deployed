package com.ecolift.controller;

import com.ecolift.dto.request.AuthRequest;
import com.ecolift.dto.request.RegisterRequest;
import com.ecolift.dto.response.AuthResponse;
import com.ecolift.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://16.16.210.58")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Re-issues a fresh JWT (with up-to-date roles) for the currently logged-in user.
     * Call this after any action that can change a user's roles mid-session
     * (e.g. registering a vehicle grants the DRIVER role) so the frontend doesn't
     * need to force a logout/login to pick up the new permissions.
     */
    @GetMapping("/refresh")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthResponse> refresh(org.springframework.security.core.Authentication authentication) {
        AuthResponse response = authService.refreshToken(authentication.getName());
        return ResponseEntity.ok(response);
    }
}
