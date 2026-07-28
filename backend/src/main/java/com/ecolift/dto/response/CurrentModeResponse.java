package com.ecolift.dto.response;

import com.ecolift.entity.UserMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CurrentModeResponse {
    private boolean success;
    private UserMode mode;

    // Populated by /users/current-mode (PUT) since switching modes can grant a
    // new role, meaning the previously-issued JWT is stale. Null on the GET
    // endpoint, where roles never change.
    private String token;
    private List<String> roles;
}