package app.hub_backend.service;

import app.hub_backend.DTO.patient.PatientSettingsDto;
import java.util.UUID;

public interface PatientService {
    PatientSettingsDto getPatientSettings(UUID patientId);
    PatientSettingsDto updatePatientSettings(UUID patientId, PatientSettingsDto settingsDto);
}