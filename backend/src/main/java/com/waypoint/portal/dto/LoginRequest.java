package com.waypoint.portal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Email @NotBlank String workEmail,
        @NotBlank String password
) {
}
