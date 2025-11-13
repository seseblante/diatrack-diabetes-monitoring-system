package app.hub_backend.DTO.logs;

import java.time.OffsetDateTime;
import java.util.UUID;

public record SymptomNoteDto(
        UUID id,
        UUID patientId,
        OffsetDateTime occurredAt,
        String symptom,
        String notes
) {}