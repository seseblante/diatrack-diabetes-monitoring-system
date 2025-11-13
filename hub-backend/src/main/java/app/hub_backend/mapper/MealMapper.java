package app.hub_backend.mapper;

import app.hub_backend.DTO.logs.MealDto;
import app.hub_backend.entities.Meal;

public class MealMapper {
    public static MealDto toDto(Meal entity) {
        if (entity == null) {
            return null;
        }
        return new MealDto(
                entity.getId(),
                entity.getPatient().getId(),
                entity.getLoggedAt(),
                entity.getDescription(),
                entity.getCarbsG()
        );
    }
}