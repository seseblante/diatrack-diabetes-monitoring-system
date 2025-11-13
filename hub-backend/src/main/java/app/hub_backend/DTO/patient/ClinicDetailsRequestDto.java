package app.hub_backend.DTO.patient;

// A clinician will send this to update their profile
public record ClinicDetailsRequestDto(
        String clinicName,
        String address,
        String scheduleDays,
        String scheduleHours,
        String contactPerson,
        String contactPhone
) {}