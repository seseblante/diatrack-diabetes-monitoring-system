package app.hub_backend.mapper;

import app.hub_backend.DTO.patient.PatientDetailDto;
import app.hub_backend.DTO.patient.PatientSettingsDto;
import app.hub_backend.entities.UserProfile;
import app.hub_backend.entities.PatientSettings;
import app.hub_backend.entities.User;

public class PatientMapper {

    public static PatientDetailDto toDetailDto(User user, UserProfile profile) {
        if (user == null || profile == null) {
            return null;
        }
        return new PatientDetailDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                user.isActive(), // Corrected getter logic
                profile.getDob(),
                profile.getSex(),
                profile.getTimezone()
        );
    }

    public static PatientSettingsDto toDto(PatientSettings entity) {
        if (entity == null) {
            return null;
        }

        return new PatientSettingsDto(
                entity.getPatient().getId(),
                entity.getTrendWindowDays(),
                entity.getUpdatedAt()
        );
    }
}