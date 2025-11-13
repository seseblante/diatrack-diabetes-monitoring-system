package app.hub_backend.mapper;

import app.hub_backend.DTO.shared.AlertDto;
import app.hub_backend.entities.Alert;

public class AlertMapper {

    public static AlertDto toDto(Alert entity) {
        if (entity == null) {
            return null;
        }

        // This mapper now correctly returns the 6 fields
        // your DTO is expecting.
        return new AlertDto(
                entity.getId(),
                entity.getPatientId(),
                entity.getType(),
                entity.getDetectedAt(),
                entity.getStatus(),
                entity.getAcknowledgedAt()
        );
    }
}