package app.hub_backend.DTO.patient;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

// This record now includes all fields, including trendWindowDays
public record PatientSettingsDto(
        UUID patientId,
        int trendWindowDays,
        OffsetDateTime updatedAt
) {}