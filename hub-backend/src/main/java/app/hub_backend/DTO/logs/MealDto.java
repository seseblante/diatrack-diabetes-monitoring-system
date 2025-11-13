package app.hub_backend.DTO.logs;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record MealDto(
        UUID id,
        UUID patientId,
        OffsetDateTime loggedAt,
        String description,
        BigDecimal carbsG
) {}