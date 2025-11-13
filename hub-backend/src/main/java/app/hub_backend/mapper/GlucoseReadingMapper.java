package app.hub_backend.mapper;

import app.hub_backend.DTO.logs.GlucoseReadingDto;
import app.hub_backend.entities.GlucoseReading;

public class GlucoseReadingMapper {
    public static GlucoseReadingDto toDto(GlucoseReading entity) {
        if (entity == null) {
            return null;
        }
        return new GlucoseReadingDto(
                entity.getId(),
                entity.getPatient().getId(),
                entity.getMeasuredAt(),
                entity.getLastMealAt(),
                entity.getValueMgdl(),
                entity.getContext()
        );
    }
}