package app.hub_backend.DTO.logs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

public final class LogRequestDto {

    private LogRequestDto() {}

    public record MealLog(
            @NotNull OffsetDateTime loggedAt,
            String description,
            BigDecimal carbsG
    ) {}

    public record SymptomLog(
            @NotNull OffsetDateTime occurredAt,
            @NotBlank String symptom,
            String severity,
            String notes
    ) {}

    // ActivityLog remains unchanged but is included for completeness
    public record ActivityLog(
            @NotNull OffsetDateTime startedAt,
            OffsetDateTime endedAt,
            String activityType,
            String intensity,
            String notes
    ) {}
}