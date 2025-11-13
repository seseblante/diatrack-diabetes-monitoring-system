package app.hub_backend.DTO.auth;

// [FIXED]
public record LoginResponseDto(
        UserDto user,
        String token  // <-- ADD THIS
) {}