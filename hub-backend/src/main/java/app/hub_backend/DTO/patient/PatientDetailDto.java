package app.hub_backend.DTO.patient;

import java.time.LocalDate;
import java.util.UUID;

public record PatientDetailDto(
        UUID id,
        String email,
        String fullName,
        String phone,
        String role,
        boolean isActive,
        LocalDate dob,
        String sex,
        String timezone
) {}