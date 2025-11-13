package app.hub_backend.DTO.logs;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ActivityLogDto(
        UUID id,
        UUID patientId,
        OffsetDateTime startedAt,
        OffsetDateTime endedAt,
        String activityType,
        String intensity,
        String notes // This field was missing
) {}