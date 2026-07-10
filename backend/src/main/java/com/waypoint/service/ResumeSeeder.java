package com.waypoint.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/** Populates MongoDB with resume documents after applicants are seeded (see order). */
@Component
@Order(2)
public class ResumeSeeder implements CommandLineRunner {

    private final ResumeService resumeService;

    public ResumeSeeder(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @Override
    public void run(String... args) {
        resumeService.seedMissing();
    }
}
