package app.hub_backend.DTO.medication;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public final class MedicationRequestDto {

    private MedicationRequestDto() {} // Prevents instantiation

    public record AddRegimen(
            @NotBlank String medicationName,
            BigDecimal doseAmount,
            String doseUnit,
            @NotBlank String scheduleDetails
    ) {}

    public record UpdateRegimen(
            @NotBlank String medicationName,
            BigDecimal doseAmount,
            String doseUnit,
            @NotBlank String scheduleDetails,
            @NotNull Boolean isActive
    ) {}

    public record LogTaken(
            @NotNull UUID regimenId
    ) {}
}