package app.hub_backend.mapper;

import app.hub_backend.DTO.auth.UserDto;
import app.hub_backend.DTO.patient.PatientDetailDto;
import app.hub_backend.entities.User;
import app.hub_backend.entities.UserProfile;

public class UserMapper {
    public static UserDto toDto(User u) {
        return new UserDto(
                u.getId(),
                u.getEmail(),
                u.getFullName(),
                u.getPhone(),
                u.getRole(),
                u.isActive(),
                u.getDob(),
                u.getSex()
        );
    }

    public static PatientDetailDto toPatientDetailDto(User user, UserProfile profile) {
        return new PatientDetailDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                user.isActive(),
                profile != null ? profile.getDob() : null,
                profile != null ? profile.getSex() : null,
                profile != null ? profile.getTimezone() : "Asia/Manila"
        );
    }
}