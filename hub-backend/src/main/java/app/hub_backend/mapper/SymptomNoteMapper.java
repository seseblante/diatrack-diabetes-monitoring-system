package app.hub_backend.mapper;

import app.hub_backend.DTO.logs.SymptomNoteDto;
import app.hub_backend.entities.SymptomNote;

public class SymptomNoteMapper {
    public static SymptomNoteDto toDto(SymptomNote entity) {
        if (entity == null) {
            return null;
        }
        return new SymptomNoteDto(
                entity.getId(),
                entity.getPatient().getId(),
                entity.getOccurredAt(),
                entity.getSymptom(),
                entity.getSeverity(),
                entity.getNotes()
        );
    }
}