package app.hub_backend.DTO.patient;

import java.time.LocalDate;

public record PatientUpdateRequest(
        String fullName,
        String phone,
        LocalDate dob,
        String sex,
        String timezone
) {}
