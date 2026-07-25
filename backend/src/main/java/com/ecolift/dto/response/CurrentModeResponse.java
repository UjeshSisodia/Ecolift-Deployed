package com.ecolift.dto.response;

import com.ecolift.entity.UserMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CurrentModeResponse {
    private boolean success;
    private UserMode mode;
}
