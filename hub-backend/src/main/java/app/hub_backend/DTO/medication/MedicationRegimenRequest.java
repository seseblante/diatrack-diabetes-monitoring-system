package app.hub_backend.DTO.medication;

import app.hub_backend.entities.enums.FrequencyType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

public record MedicationRegimenRequest(
        @NotBlank String medicationName,
        BigDecimal doseAmount,
        String doseUnit,
        @NotNull FrequencyType frequencyType,
        @NotNull @Min(1) Integer frequencyValue,
        List<LocalTime> timesOfDay
) {}