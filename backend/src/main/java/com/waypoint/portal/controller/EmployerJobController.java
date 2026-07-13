package com.waypoint.portal.controller;

import com.waypoint.portal.dto.JobPostingRequest;
import com.waypoint.portal.dto.JobPostingResponse;
import com.waypoint.portal.service.JobPostingService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employer/jobs")
public class EmployerJobController {

    private final JobPostingService jobPostingService;

    public EmployerJobController(JobPostingService jobPostingService) {
        this.jobPostingService = jobPostingService;
    }

    @GetMapping
    public List<JobPostingResponse> list(Principal principal) {
        return jobPostingService.findForEmployer(principal.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobPostingResponse create(
            Principal principal,
            @Valid @RequestBody JobPostingRequest request
    ) {
        return jobPostingService.create(principal.getName(), request);
    }
}
