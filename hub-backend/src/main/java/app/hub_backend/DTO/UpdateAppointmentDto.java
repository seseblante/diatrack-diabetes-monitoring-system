package app.hub_backend.DTO;

import java.time.OffsetDateTime;

public record UpdateAppointmentDto(
        OffsetDateTime nextAppointmentAt
) {}
