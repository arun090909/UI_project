package com.waypoint.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

/**
 * Explicit Mongo wiring so the database name is unambiguous ("waypoint"). Relying on
 * {@code spring.data.mongodb.database} alone resolved to the default "test" database here, so we
 * pin the client and database name directly.
 */
@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Override
    protected String getDatabaseName() {
        return "waypoint";
    }

    @Override
    public MongoClient mongoClient() {
        return MongoClients.create("mongodb://localhost:27017");
    }
}
