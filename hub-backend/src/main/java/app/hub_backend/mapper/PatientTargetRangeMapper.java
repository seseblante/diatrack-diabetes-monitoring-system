package app.hub_backend.mapper;

import app.hub_backend.DTO.patient.PatientTargetRangeDto;
import app.hub_backend.entities.PatientTargetRange;

public class PatientTargetRangeMapper {

    public static PatientTargetRangeDto toDto(PatientTargetRange entity) {
        if (entity == null) {
            return null;
        }
        return new PatientTargetRangeDto(
                entity.getId(),
                entity.getPatient().getId(),
                entity.getContext(),
                entity.getTargetLowMgdl(),
                entity.getTargetHighMgdl()
        );
    }
}