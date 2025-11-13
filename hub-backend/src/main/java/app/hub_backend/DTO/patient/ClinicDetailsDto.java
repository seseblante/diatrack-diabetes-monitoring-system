package app.hub_backend.DTO.patient;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ClinicDetailsDto(
        UUID id,
        UUID clinicianId,
        String clinicName,
        String address,
        String scheduleDays,
        String scheduleHours,
        String contactPerson,
        String contactPhone,
        OffsetDateTime updatedAt
) {}