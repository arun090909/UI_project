package com.waypoint.portal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record RegisterEmployerRequest(
        @NotBlank String companyName,
        @NotBlank String industry,
        @NotBlank String companySize,
        String founded,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @Email @NotBlank String workEmail,
        @NotBlank String phone,
        @Size(min = 8) String password,
        @NotBlank String city,
        String streetAddress,
        @NotBlank String zipCode,
        @Email String careersContactEmail,
        String website,
        String aboutCompany,
        List<String> hiringAreas
) {
}
