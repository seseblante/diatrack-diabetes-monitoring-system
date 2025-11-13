package app.hub_backend.mapper;

import app.hub_backend.DTO.patient.QuickMessageDto;
import app.hub_backend.entities.QuickMessage;

public class QuickMessageMapper {

    public static QuickMessageDto toDto(QuickMessage entity) {
        if (entity == null) {
            return null;
        }
        return new QuickMessageDto(
                entity.getId(),
                entity.getPatientClinicianLink().getId(),
                // The sender is always the clinician in this table
                entity.getPatientClinicianLink().getClinician().getId(),
                entity.getMessageContent(),
                entity.getStatus(),
                entity.getCreatedAt(),
                entity.getReadAt()
        );
    }
}