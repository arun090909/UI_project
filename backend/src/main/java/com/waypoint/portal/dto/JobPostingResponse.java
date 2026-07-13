package com.waypoint.portal.dto;

import java.time.LocalDate;
import java.util.List;

public record JobPostingResponse(
        String id,
        String jobId,
        String title,
        String workType,
        String location,
        String employmentType,
        String experienceLevel,
        Integer salaryMin,
        Integer salaryMax,
        List<String> requiredSkills,
        String description,
        LocalDate applicationDeadline,
        boolean resumeRequired,
        String status,
        int applicantCount,
        int reviewedCount,
        int interviewingCount
) {
}
