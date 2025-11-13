package app.hub_backend.mapper;

import app.hub_backend.DTO.auth.UserDto;
import app.hub_backend.entities.User;

public class UserMapper {
    public static UserDto toDto(User u) {
        return new UserDto(
                u.getId(),
                u.getEmail(),
                u.getFullName(),
                u.getPhone(),
                u.getRole(),
                u.isActive()
        );
    }
}