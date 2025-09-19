package app.hub_backend.DTO;

import app.hub_backend.entities.Role;

import java.util.UUID;

public record UserDto(
        UUID id,
        String email,
        String fullName,
        String phone,
        Role role,
        boolean isActive
) {}
