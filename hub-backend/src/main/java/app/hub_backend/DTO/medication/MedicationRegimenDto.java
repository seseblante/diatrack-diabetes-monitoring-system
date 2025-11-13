package app.hub_backend.DTO.medication;

import app.hub_backend.entities.enums.FrequencyType;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record MedicationRegimenDto(
        UUID id,
        UUID patientId,
        String medicationName,
        BigDecimal doseAmount,
        String doseUnit,
        FrequencyType frequencyType,
        int frequencyValue,
        List<LocalTime> timesOfDay,
        boolean isActive
) {}