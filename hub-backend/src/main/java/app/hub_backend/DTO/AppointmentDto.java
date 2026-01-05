package app.hub_backend.DTO;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AppointmentDto(
        UUID id,
        UUID patientId,
        String patientName,
        String patientPhone,
        String patientEmail,
        OffsetDateTime nextAppointmentAt,
        String status
) {
}
