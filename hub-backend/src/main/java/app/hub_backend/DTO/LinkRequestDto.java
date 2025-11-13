package app.hub_backend.DTO;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record LinkRequestDto(
        @NotNull UUID patientId,
        @NotNull UUID clinicianId
) {}