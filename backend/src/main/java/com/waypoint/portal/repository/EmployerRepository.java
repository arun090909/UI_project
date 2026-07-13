package com.waypoint.portal.repository;

import com.waypoint.portal.domain.Employer;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EmployerRepository extends MongoRepository<Employer, String> {
    Optional<Employer> findByWorkEmail(String workEmail);

    boolean existsByWorkEmail(String workEmail);
}
