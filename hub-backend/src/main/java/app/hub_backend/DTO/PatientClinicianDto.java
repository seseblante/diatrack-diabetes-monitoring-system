package app.hub_backend.DTO;

import java.time.OffsetDateTime;
import java.util.UUID;

public record PatientClinicianDto(
        UUID id,
        UUID patientId,
        String patientName,
        UUID clinicianId,
        String clinicianName,
        String status,
        OffsetDateTime linkedAt,
        OffsetDateTime nextAppointmentAt
) {}