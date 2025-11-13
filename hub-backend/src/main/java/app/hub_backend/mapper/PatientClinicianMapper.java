package app.hub_backend.mapper;

import app.hub_backend.DTO.PatientClinicianDto;
import app.hub_backend.entities.PatientClinician;

public class PatientClinicianMapper {
    public static PatientClinicianDto toDto(PatientClinician entity) {
        if (entity == null) {
            return null;
        }
        // This forces Hibernate to load the user details before serialization
        return new PatientClinicianDto(
                entity.getId(),
                entity.getPatient().getId(),
                entity.getPatient().getFullName(),
                entity.getClinician().getId(),
                entity.getClinician().getFullName(),
                entity.getStatus(),
                entity.getLinkedAt(),
                entity.getNextAppointmentAt()
        );
    }
}