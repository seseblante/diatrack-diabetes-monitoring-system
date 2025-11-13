package app.hub_backend.DTO.patient;

import jakarta.validation.constraints.NotBlank;

public record ClinicianNoteRequestDto(
        @NotBlank String noteContent
) {}