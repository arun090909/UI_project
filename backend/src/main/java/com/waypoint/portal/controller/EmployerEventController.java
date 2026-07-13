package com.waypoint.portal.controller;

import com.waypoint.portal.dto.HiringEventResponse;
import com.waypoint.portal.service.HiringEventService;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employer/events")
public class EmployerEventController {

    private final HiringEventService hiringEventService;

    public EmployerEventController(HiringEventService hiringEventService) {
        this.hiringEventService = hiringEventService;
    }

    @GetMapping
    public List<HiringEventResponse> list(Principal principal) {
        return hiringEventService.findForEmployer(principal.getName());
    }
}
