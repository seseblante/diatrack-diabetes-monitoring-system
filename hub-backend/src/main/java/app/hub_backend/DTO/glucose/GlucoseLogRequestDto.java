package app.hub_backend.DTO.glucose;

import app.hub_backend.entities.enums.GlucoseContext;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record GlucoseLogRequestDto(
        @NotNull OffsetDateTime measuredAt,
        OffsetDateTime lastMealAt,
        @NotNull BigDecimal valueMgdl,
        @NotNull GlucoseContext context
) {}