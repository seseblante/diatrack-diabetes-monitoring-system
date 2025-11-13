package app.hub_backend.DTO.patient;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ClinicianNoteDto(
        UUID id,
        UUID patientClinicianLinkId,
        String noteContent,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}