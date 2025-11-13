package app.hub_backend.mapper;

import app.hub_backend.DTO.patient.ClinicianNoteDto;
import app.hub_backend.entities.ClinicianNote;

public class ClinicianNoteMapper {

    public static ClinicianNoteDto toDto(ClinicianNote entity) {
        if (entity == null) {
            return null;
        }
        return new ClinicianNoteDto(
                entity.getId(),
                entity.getPatientClinicianLink().getId(),
                entity.getNoteContent(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}