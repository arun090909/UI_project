package com.waypoint.portal.service;

import com.waypoint.portal.domain.JobPosting;
import com.waypoint.portal.dto.JobPostingRequest;
import com.waypoint.portal.dto.JobPostingResponse;
import com.waypoint.portal.repository.JobPostingRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;

    public JobPostingService(JobPostingRepository jobPostingRepository) {
        this.jobPostingRepository = jobPostingRepository;
    }

    public List<JobPostingResponse> findForEmployer(String employerId) {
        return jobPostingRepository.findByEmployerIdOrderByCreatedAtDesc(employerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public JobPostingResponse create(String employerId, JobPostingRequest request) {
        JobPosting posting = new JobPosting();
        posting.setEmployerId(employerId);
        posting.setJobId(request.jobId());
        posting.setTitle(request.title());
        posting.setWorkType(request.workType());
        posting.setLocation(request.location());
        posting.setEmploymentType(request.employmentType());
        posting.setExperienceLevel(request.experienceLevel());
        posting.setSalaryMin(request.salaryMin());
        posting.setSalaryMax(request.salaryMax());
        posting.setRequiredSkills(request.requiredSkills() == null ? new ArrayList<>() : request.requiredSkills());
        posting.setDescription(request.description());
        posting.setApplicationDeadline(request.applicationDeadline());
        posting.setResumeRequired(true);
        posting.setStatus("Published");

        return toResponse(jobPostingRepository.save(posting));
    }

    private JobPostingResponse toResponse(JobPosting posting) {
        return new JobPostingResponse(
                posting.getId(),
                posting.getJobId(),
                posting.getTitle(),
                posting.getWorkType(),
                posting.getLocation(),
                posting.getEmploymentType(),
                posting.getExperienceLevel(),
                posting.getSalaryMin(),
                posting.getSalaryMax(),
                posting.getRequiredSkills(),
                posting.getDescription(),
                posting.getApplicationDeadline(),
                posting.isResumeRequired(),
                posting.getStatus(),
                posting.getApplicantCount(),
                posting.getReviewedCount(),
                posting.getInterviewingCount()
        );
    }
}
