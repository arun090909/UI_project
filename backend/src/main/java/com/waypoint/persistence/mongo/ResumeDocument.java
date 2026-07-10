package com.waypoint.persistence.mongo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/** A stored resume document, keyed by applicant id, held in MongoDB (the document store). */
@Document(collection = "resumes")
public class ResumeDocument {

    @Id
    private String applicantId;
    private String filename;
    private String contentType;
    private byte[] content;
    private long size;
    private Instant uploadedAt;

    protected ResumeDocument() {
    }

    public ResumeDocument(String applicantId, String filename, String contentType, byte[] content, Instant uploadedAt) {
        this.applicantId = applicantId;
        this.filename = filename;
        this.contentType = contentType;
        this.content = content;
        this.size = content == null ? 0 : content.length;
        this.uploadedAt = uploadedAt;
    }

    public String getApplicantId() {
        return applicantId;
    }

    public String getFilename() {
        return filename;
    }

    public String getContentType() {
        return contentType;
    }

    public byte[] getContent() {
        return content;
    }

    public long getSize() {
        return size;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }
}
