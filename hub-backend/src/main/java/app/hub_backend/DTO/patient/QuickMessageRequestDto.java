package app.hub_backend.DTO.patient;

import jakarta.validation.constraints.NotBlank;

public record QuickMessageRequestDto(
        @NotBlank
        String messageContent // e.g., "Schedule an appointment with me"
) {}