package com.waypoint.portal.repository;

import com.waypoint.portal.domain.HiringEvent;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HiringEventRepository extends MongoRepository<HiringEvent, String> {
    List<HiringEvent> findByEmployerIdOrderByStartsOnAsc(String employerId);
}
