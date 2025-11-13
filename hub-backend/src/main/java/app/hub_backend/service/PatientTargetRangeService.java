package app.hub_backend.service;

import app.hub_backend.DTO.patient.PatientTargetRangeDto;
import app.hub_backend.DTO.patient.PatientTargetRangeRequestDto;
import app.hub_backend.entities.User;

import java.util.List;
import java.util.UUID;

public interface PatientTargetRangeService {

    List<PatientTargetRangeDto> getTargetsByPatient(UUID patientId);

    PatientTargetRangeDto createOrUpdateTarget(UUID patientId, PatientTargetRangeRequestDto request);

    /**
     * Initializes a patient with default clinical targets upon registration.
     */
    void createDefaultTargetsForNewPatient(User patient);
}