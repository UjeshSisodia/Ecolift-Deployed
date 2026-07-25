package com.ecolift.controller;

import com.ecolift.dto.request.CurrentModeRequest;
import com.ecolift.dto.response.CurrentModeResponse;
import com.ecolift.entity.User;
import com.ecolift.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/current-mode")
    public ResponseEntity<CurrentModeResponse> getCurrentMode(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getCurrentUserMode(email);

        return ResponseEntity.ok(CurrentModeResponse.builder()
                .success(true)
                .mode(user.getCurrentMode())
                .build());
    }

    @PutMapping("/current-mode")
    public ResponseEntity<CurrentModeResponse> updateCurrentMode(
            @Valid @RequestBody CurrentModeRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userService.updateCurrentMode(email, request.getMode());

        return ResponseEntity.ok(CurrentModeResponse.builder()
                .success(true)
                .mode(user.getCurrentMode())
                .build());
    }
}
