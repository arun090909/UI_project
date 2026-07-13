package com.waypoint.portal.service;

import com.waypoint.portal.domain.Employer;
import com.waypoint.portal.dto.AuthResponse;
import com.waypoint.portal.dto.EmployerSummary;
import com.waypoint.portal.dto.LoginRequest;
import com.waypoint.portal.dto.RegisterEmployerRequest;
import com.waypoint.portal.repository.EmployerRepository;
import com.waypoint.portal.security.JwtService;
import java.util.ArrayList;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final EmployerRepository employerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            EmployerRepository employerRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.employerRepository = employerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse registerEmployer(RegisterEmployerRequest request) {
        String normalizedEmail = request.workEmail().trim().toLowerCase();
        if (employerRepository.existsByWorkEmail(normalizedEmail)) {
            throw new IllegalArgumentException("An employer account already exists for this email.");
        }

        Employer employer = new Employer();
        employer.setCompanyName(request.companyName());
        employer.setIndustry(request.industry());
        employer.setCompanySize(request.companySize());
        employer.setFounded(request.founded());
        employer.setFirstName(request.firstName());
        employer.setLastName(request.lastName());
        employer.setWorkEmail(normalizedEmail);
        employer.setPhone(request.phone());
        employer.setPasswordHash(passwordEncoder.encode(request.password()));
        employer.setCity(request.city());
        employer.setStreetAddress(request.streetAddress());
        employer.setZipCode(request.zipCode());
        employer.setCareersContactEmail(request.careersContactEmail());
        employer.setWebsite(request.website());
        employer.setAboutCompany(request.aboutCompany());
        employer.setHiringAreas(request.hiringAreas() == null ? new ArrayList<>() : request.hiringAreas());

        Employer saved = employerRepository.save(employer);
        return authResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        Employer employer = employerRepository.findByWorkEmail(request.workEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(request.password(), employer.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        return authResponse(employer);
    }

    private AuthResponse authResponse(Employer employer) {
        String token = jwtService.createToken(employer.getId(), employer.getWorkEmail());
        return new AuthResponse("Bearer", token, toSummary(employer));
    }

    public EmployerSummary toSummary(Employer employer) {
        return new EmployerSummary(
                employer.getId(),
                employer.getCompanyName(),
                employer.getWorkEmail(),
                employer.getFirstName() + " " + employer.getLastName(),
                employer.getCity()
        );
    }
}
