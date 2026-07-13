package com.waypoint.portal.dto;

import java.time.LocalDate;

public record HiringEventResponse(
        String id,
        String title,
        String subtitle,
        LocalDate startsOn,
        LocalDate endsOn,
        int registeredCount
) {
}
