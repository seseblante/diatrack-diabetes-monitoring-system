package app.hub_backend.DTO.medication;

import java.time.OffsetDateTime;
import java.util.UUID;

public record MedicationLogDto(
        UUID id,
        UUID regimenId,
        OffsetDateTime takenAt
) {}