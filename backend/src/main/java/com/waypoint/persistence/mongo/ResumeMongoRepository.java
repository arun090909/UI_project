package com.waypoint.persistence.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ResumeMongoRepository extends MongoRepository<ResumeDocument, String> {
}
