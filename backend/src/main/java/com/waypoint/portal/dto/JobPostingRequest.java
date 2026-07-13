package com.waypoint.portal.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.List;

public record JobPostingRequest(
        @NotBlank String jobId,
        @NotBlank String title,
        @NotBlank String workType,
        @NotBlank String location,
        @NotBlank String employmentType,
        String experienceLevel,
        Integer salaryMin,
        Integer salaryMax,
        List<String> requiredSkills,
        @NotBlank String description,
        LocalDate applicationDeadline,
        boolean resumeRequired
) {
}
