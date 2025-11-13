package app.hub_backend.DTO.shared;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ClinicianNotificationDto(
        UUID id,
        UUID patientId,
        UUID clinicianId,
        String type,
        OffsetDateTime triggeredAt,
        String status
) {}