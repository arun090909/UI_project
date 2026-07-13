package com.waypoint.portal.repository;

import com.waypoint.portal.domain.JobPosting;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JobPostingRepository extends MongoRepository<JobPosting, String> {
    List<JobPosting> findByEmployerIdOrderByCreatedAtDesc(String employerId);
}
