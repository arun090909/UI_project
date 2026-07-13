package com.waypoint.portal.dto;

public record EmployerSummary(
        String id,
        String companyName,
        String workEmail,
        String contactName,
        String city
) {
}
