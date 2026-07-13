package com.waypoint.portal.service;

import com.waypoint.portal.dto.HiringEventResponse;
import com.waypoint.portal.repository.HiringEventRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class HiringEventService {

    private final HiringEventRepository hiringEventRepository;

    public HiringEventService(HiringEventRepository hiringEventRepository) {
        this.hiringEventRepository = hiringEventRepository;
    }

    public List<HiringEventResponse> findForEmployer(String employerId) {
        return hiringEventRepository.findByEmployerIdOrderByStartsOnAsc(employerId)
                .stream()
                .map(event -> new HiringEventResponse(
                        event.getId(),
                        event.getTitle(),
                        event.getSubtitle(),
                        event.getStartsOn(),
                        event.getEndsOn(),
                        event.getRegisteredCount()
                ))
                .toList();
    }
}
