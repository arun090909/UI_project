package com.waypoint.web;

import com.waypoint.model.Applicant;
import com.waypoint.model.Stage;
import com.waypoint.persistence.mongo.ResumeDocument;
import com.waypoint.service.ApplicantService;
import com.waypoint.service.ResumeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/applicants")
public class ApplicantController {

    private final ApplicantService service;
    private final ResumeService resumeService;

    public ApplicantController(ApplicantService service, ResumeService resumeService) {
        this.service = service;
        this.resumeService = resumeService;
    }

    /** List applicants, optionally filtered by pipeline stage and/or posting. */
    @GetMapping
    public List<Applicant> list(
            @RequestParam(required = false) String stage,
            @RequestParam(required = false) String posting) {
        Stage stageFilter = (stage == null || stage.isBlank()) ? null : Stage.fromLabel(stage);
        String postingFilter = (posting == null || posting.isBlank()) ? null : posting;
        return service.findAll(stageFilter, postingFilter);
    }

    @GetMapping("/{id}")
    public Applicant getById(@PathVariable String id) {
        return service.findById(id)
                .orElseThrow(() -> notFound(id));
    }

    /** Advance or change an applicant's stage — backs the "Move to Selected" action. */
    @PatchMapping("/{id}/stage")
    public Applicant updateStage(@PathVariable String id, @Valid @RequestBody UpdateStageRequest request) {
        return service.updateStage(id, request.stage())
                .orElseThrow(() -> notFound(id));
    }

    /** Book (or reschedule) the candidate's call — backs the "Schedule call" action. */
    @PatchMapping("/{id}/call")
    public Applicant scheduleCall(@PathVariable String id, @Valid @RequestBody ScheduleCallRequest request) {
        return service.scheduleCall(id, request.callTime())
                .orElseThrow(() -> notFound(id));
    }

    /** Serves the candidate's resume PDF (stored in MongoDB) — backs the "View resume" action. */
    @GetMapping(value = "/{id}/resume", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> resume(@PathVariable String id) {
        ResumeDocument resume = resumeService.getResume(id).orElseThrow(() -> notFound(id));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(resume.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resume.getFilename() + "\"")
                .body(resume.getContent());
    }

    private ResponseStatusException notFound(String id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Applicant not found: " + id);
    }

    /** A bad stage/posting value in a query param is a client error, not a 500. */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleBadArgument(IllegalArgumentException ex) {
        return ex.getMessage();
    }
}
