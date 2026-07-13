package com.waypoint.portal.controller;

import com.waypoint.portal.dto.AuthResponse;
import com.waypoint.portal.dto.LoginRequest;
import com.waypoint.portal.dto.RegisterEmployerRequest;
import com.waypoint.portal.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/employer/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse registerEmployer(@Valid @RequestBody RegisterEmployerRequest request) {
        return authService.registerEmployer(request);
    }

    @PostMapping("/employer/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
