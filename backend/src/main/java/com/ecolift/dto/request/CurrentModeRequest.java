package com.ecolift.dto.request;

import com.ecolift.entity.UserMode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CurrentModeRequest {
    @NotNull(message = "Mode is required")
    private UserMode mode;
}
