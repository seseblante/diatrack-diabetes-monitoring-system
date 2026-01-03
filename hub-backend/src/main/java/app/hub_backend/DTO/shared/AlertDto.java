package app.hub_backend.DTO.shared;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AlertDto(
        UUID id,
        UUID patientId,
        String type,
        OffsetDateTime detectedAt,
        String status,
        OffsetDateTime acknowledgedAt,
        String notes
) {}