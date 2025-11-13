package app.hub_backend.mapper;

import app.hub_backend.DTO.medication.MedicationLogDto;
import app.hub_backend.DTO.medication.MedicationRegimenDto;
import app.hub_backend.entities.MedicationLog;
import app.hub_backend.entities.MedicationRegimen;

public class MedicationMapper {

    public static MedicationRegimenDto toDto(MedicationRegimen entity) {
        if (entity == null) {
            return null;
        }
        return new MedicationRegimenDto(
                entity.getId(),
                entity.getPatient().getId(),
                entity.getMedicationName(),
                entity.getDoseAmount(),
                entity.getDoseUnit(),
                entity.getFrequencyType(),
                entity.getFrequencyValue(),
                entity.getTimesOfDay(),
                entity.isActive()
        );
    }

    public static MedicationLogDto toDto(MedicationLog entity) {
        if (entity == null) {
            return null;
        }
        return new MedicationLogDto(
                entity.getId(),
                entity.getRegimen().getId(),
                entity.getTakenAt()
        );
    }
}