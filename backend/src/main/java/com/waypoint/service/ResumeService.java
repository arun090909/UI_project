package com.waypoint.service;

import com.waypoint.model.Applicant;
import com.waypoint.persistence.ApplicantEntity;
import com.waypoint.persistence.ApplicantJpaRepository;
import com.waypoint.persistence.mongo.ResumeDocument;
import com.waypoint.persistence.mongo.ResumeMongoRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

/**
 * Serves resume documents out of MongoDB. Resumes are generated once and stored as documents,
 * illustrating the spec's split: relational records in PostgreSQL, documents in MongoDB.
 */
@Service
public class ResumeService {

    private static final String CONTENT_TYPE = "application/pdf";

    private final ResumeMongoRepository resumes;
    private final ApplicantJpaRepository applicants;

    public ResumeService(ResumeMongoRepository resumes, ApplicantJpaRepository applicants) {
        this.resumes = resumes;
        this.applicants = applicants;
    }

    public Optional<ResumeDocument> getResume(String applicantId) {
        return resumes.findById(applicantId);
    }

    /** Generates and stores a PDF for every applicant that doesn't yet have a resume document. */
    public void seedMissing() {
        for (ApplicantEntity entity : applicants.findAll()) {
            if (resumes.existsById(entity.getId())) {
                continue;
            }
            Applicant applicant = entity.toDto();
            byte[] pdf = ResumePdf.generate(applicant);
            resumes.save(new ResumeDocument(
                    applicant.id(), applicant.resumeFile(), CONTENT_TYPE, pdf, Instant.now()));
        }
    }
}
