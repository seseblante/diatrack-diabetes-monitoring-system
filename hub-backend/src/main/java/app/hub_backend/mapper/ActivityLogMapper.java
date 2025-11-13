package app.hub_backend.mapper;

import app.hub_backend.DTO.logs.ActivityLogDto;
import app.hub_backend.entities.ActivityLog;

public class ActivityLogMapper {
    public static ActivityLogDto toDto(ActivityLog entity) {
        if (entity == null) {
            return null;
        }
        return new ActivityLogDto(
                entity.getId(),
                entity.getPatient().getId(),
                entity.getStartedAt(),
                entity.getEndedAt(),
                entity.getActivityType(),
                entity.getIntensity(),
                entity.getNotes()
        );
    }
}