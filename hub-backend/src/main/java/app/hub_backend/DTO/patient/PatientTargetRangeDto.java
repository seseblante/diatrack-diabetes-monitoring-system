package app.hub_backend.DTO.patient;

import app.hub_backend.entities.enums.GlucoseContext;

import java.math.BigDecimal;
import java.util.UUID;

public record PatientTargetRangeDto(
        UUID id,
        UUID patientId,
        GlucoseContext context,
        BigDecimal targetLowMgdl,
        BigDecimal targetHighMgdl
) {}