package com.waypoint.portal.dto;

public record AuthResponse(
        String tokenType,
        String accessToken,
        EmployerSummary employer
) {
}
