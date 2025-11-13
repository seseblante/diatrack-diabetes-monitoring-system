package app.hub_backend.DTO.auth;

import java.util.UUID;

public record UserDto(
        UUID id,
        String email,
        String fullName,
        String phone,
        String role,
        boolean isActive
) {}
