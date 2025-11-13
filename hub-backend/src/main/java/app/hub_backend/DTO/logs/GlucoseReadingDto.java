package app.hub_backend.DTO.logs;

import app.hub_backend.entities.enums.GlucoseContext;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record GlucoseReadingDto(
        UUID id,
        UUID patientId, // This field was missing
        OffsetDateTime measuredAt,
        OffsetDateTime lastMealAt,
        BigDecimal valueMgdl,
        GlucoseContext context
) {}