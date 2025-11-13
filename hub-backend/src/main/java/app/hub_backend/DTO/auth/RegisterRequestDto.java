package app.hub_backend.DTO.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequestDto(
        @Email @NotBlank String email,
        @NotBlank String password,
        @NotBlank String fullName,
        String phone,
        @NotNull String role, // <-- CHANGED
        boolean isConsentGiven
) {}