package app.hub_backend.mapper;

import app.hub_backend.DTO.patient.ClinicDetailsDto;
import app.hub_backend.entities.ClinicDetails;

public class ClinicDetailsMapper {

    public static ClinicDetailsDto toDto(ClinicDetails entity) {
        if (entity == null) {
            return null;
        }
        return new ClinicDetailsDto(
                entity.getId(),
                entity.getClinician().getId(),
                entity.getClinicName(),
                entity.getAddress(),
                entity.getScheduleDays(),
                entity.getScheduleHours(),
                entity.getContactPerson(),
                entity.getContactPhone(),
                entity.getUpdatedAt()
        );
    }
}