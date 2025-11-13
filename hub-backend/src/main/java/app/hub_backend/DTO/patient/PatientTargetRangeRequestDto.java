package app.hub_backend.DTO.patient;

import app.hub_backend.entities.enums.GlucoseContext;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PatientTargetRangeRequestDto(
        @NotNull(message = "Context is required")
        GlucoseContext context,

        @NotNull
        @DecimalMin(value = "40.0", message = "Target low must be >= 40")
        BigDecimal targetLowMgdl,

        @NotNull
        @DecimalMin(value = "80.0", message = "Target high must be >= 80")
        BigDecimal targetHighMgdl
) {}